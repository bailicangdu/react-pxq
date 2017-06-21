import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {Header,template} from './common/mixin';


class List extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        return (
            <ul className="team_list">
                {
                    this.props.list.map((item, index) => {
                        return <ListItem key={index} {...item} index={index}/>
                    })
                }
            </ul>
        );
    }
}


class ListItem extends Component {
    static contextTypes = {
        deleteItem: React.PropTypes.any
    }

    constructor(props,context) {
        super(props,context);
        this.state = {

        }

        this.deleleOrder = () => {
            this.context.getData('/sales/sales/deleteSales',{sales_id:this.props.sales_id}, (res) => {
                if (res.http_code == 200) {
                    this.context.deleteItem(this.props.index);
                    Tool.alert(res.data.msg)
                }else{
                    Tool.alert(res.msg)
                }
            }, 'deleteItem')
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        let {created_at,customers_phone,customers_name,product,product_price,commission,sales_money,type,sales_id,index,content} = this.props;
        let context;
        let showTip;
        let creatArr = created_at.split(':');
        created_at = creatArr[0] + ':' + creatArr[1];
        if (type == 'FAILED') {
            context = (<span className='order_status1'>未通过</span>);
            showTip = (<div className='failed_reason clear'>
                    <span className='left'>未通过原因：</span>
                    <span className='reason_content left'>{content}</span>
                    <span className='right delete_order' onClick={this.deleleOrder}>删除</span>
                </div>)
        }else if (type == 'UNAUDIT') {
            context = (<span className='order_status1'>待审核</span>);
            showTip = (<div className='failed_reason'>等待管理员审核，审核通过后，佣金将结算至账户</div>)
        }else if (type == 'PASS') {
            context = (<span className='order_status2'>已通过</span>);
            showTip = null;
        }

        return (
            <li className='order_li'>
                <header>创建时间：{created_at}{context}</header>
                <div className='order_inform'>
                    <div className='order_style'>
                        <span>客<span style={{display:'inline-block',width:'1.3rem'}}></span>户：</span>
                        <span style={{marginRight:'0.875rem'}}>{customers_name}</span>
                        <span>{customers_phone}</span>
                    </div>
                    <div className='order_style ellips'>
                        <span>购买商品：</span>
                        {
                            product.map((item,index) => {
                                return <span style={{marginRight:'0.875rem'}} key={index}>{item.product_name}</span>
                            })
                        }
                    </div>
                    <div className='order_style'>
                        <span>订单金额：</span>
                        <span style={{marginRight:'1.95rem',color:'red'}}>¥{sales_money}</span>
                        <span>佣金：</span>
                        <span style={{color:'red'}}>¥{commission}</span>
                    </div>
                </div>
                {showTip}
            </li>
        );
    }
}



class Main extends Component {
    static propTypes = {
        saleRecord:PropTypes.object.isRequired
    }

    static childContextTypes = {
        deleteItem: React.PropTypes.any,
        getData: React.PropTypes.any,
    }

    constructor(props,context) {
        super(props,context);
        this.state = {
            data:[],  //分销商列表数组
            oldName:'waited', //上次选中的类别，默认为waited
            choosedClass:{waited:'team_choosed'}, //当前选中的类别，以此设置class名
            currentPage:1, //当前所在页数
            totalPage:1  ,//总共的页数
            limit:20 ,  //每页加载的数量
            shouldUpdata:true,  //当获取数据后才能进行加载
        }
        this.chooseStatus = (event) => { //筛选类型
            let name = null;
            if (event.target.children[0]) {
                name = event.target.children[0].getAttribute('name')
            }else{
                name = event.target.getAttribute('name')
            }
            if (name !== this.state.oldName) {
                this.state.oldName = name;
                this.state.choosedClass = {};
                this.state.choosedClass[name] = 'team_choosed';
                this.forceUpdate();
                let type = '';
                if (name == 'failed') {
                    type = 'FAILED';
                }else if(name == 'waited'){
                    type = 'UNAUDIT';
                }else if(name == 'passed'){
                    type = 'PASS';
                }
                this.props.getData('/shopro/data/record',{page:1,type:type}, (res) => {
                    if (res.http_code == 200) {
                        this.setState({
                            data:res.data.data,
                            currentPage:1,
                            totalPage:res.data.totalPage
                        })
                    }else{
                        Tool.alert(res.data.msg)
                    }
                }, 'changeType')
            }
        }
        this.deleteInform = (index) => { //删除信息
           this.state.data.splice(index,1)
        }

        this.getNextPage = (currentPage) => { //加载下一页
            if (!this.state.shouldUpdata) {
                return
            }
            this.state.shouldUpdata = false;
            let type = '';
            if (this.state.oldName == 'failed') {
                type = 'FAILED';
            }else if(this.state.oldName == 'waited'){
                type = 'UNAUDIT';
            }else if(this.state.oldName == 'passed'){
                type = 'PASS';
            }
            this.props.getData('/sales/sales/salesList',{page:currentPage,type:type}, (res) => {
                this.state.currentPage = currentPage;
                this.state.shouldUpdata = true;
                if (res.http_code == 200) {
                    this.state.data = this.state.data.concat(res.data.data)
                    this.setState(this.state.data)
                }else{
                    Tool.alert(res.msg)
                }
            }, 'nextPage')
        }
    }
    getChildContext () {
        return {
            deleteItem: this.props.deleteItem,
            getData:this.props.getData
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.saleRecord.index !== undefined) {
             this.deleteInform(nextProps.saleRecord.index)
        }else{
            let {data} = nextProps.state;
            if (data) {
                this.state.data = data.data.data||[];
                this.state.currentPage = data.data.currentPage||1;
                this.state.totalPage = data.data.totalPage||1;
            }
        }

    }

    componentWillUpdate(nextProps, nextState) {

    }

    render() {
        if (this.state.currentPage < this.state.totalPage) {
            Tool.nextPage(this.refs.Container,this.state.currentPage,this.state.totalPage,this.getNextPage,this.state.shouldUpdata)
        }
        return (
            <div ref='Container' className="component_container">
               <Header goback title='销售记录'/>
               <nav className='team_nav'>
                   <ul className='clear' onClick={this.chooseStatus} >
                       <li className={this.state.choosedClass['failed']}><p name='failed'>未通过</p><span></span></li>
                       <li className={this.state.choosedClass['waited']}><p name='waited'>待审核</p><span></span></li>
                       <li className={this.state.choosedClass['passed']}><p name='passed'>已通过</p></li>
                   </ul>
               </nav>
                {
                    this.state.data.length > 0 ? <List list={this.state.data} /> : null
                }
               
            </div>
        );
    }
}


export default template({
    id: 'saleRecord',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/shopro/data/record',
    data: {
            page:1,
            type:'UNAUDIT'
        }
});

import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { History, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {Header, template} from './common/mixin';



class List extends Component {
   shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        return (
            <div> 
                <ul>
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem key={index} index={index} {...item}/>
                        })
                    }
                </ul>
            </div>
        );
    }
}


class ListItem extends Component {
    constructor(){
        super()
        this.state = {
            showlist:false
        }
        
        this.changeshowlist = () => {
            let showlist = !this.state.showlist
            this.setState({showlist:showlist})
        }

    }

    componentWillMount() {
        if(this.props.index == 0){
            this.state.showlist = true;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        let {month,totalMoney,applyList,index} = this.props;
        let showList = this.state.showlist;
        if (!showList) {
            totalMoney = (<span className='right'>¥ {totalMoney}</span>)
        }else{
            totalMoney = null;
        }
        return (
            <li className='apply_item'>
                <header className='apply_month clear' onClick={this.changeshowlist}>
                    <span className='left'>{month}</span>
                    {totalMoney}
                </header>
                {
                    showList ?<ul className='detail_ul'>{
                            this.props.applyList.map((item,index) => {
                                return <DetailItem key={index} {...item} />
                            })
                        }
                    </ul>:null
                }
            </li>
        );
    }
}



class DetailItem extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    render(){
        let {startTime,endTime,applyMoney,status} = this.props;
        return(
            <li className={`apply_detail_item ${status == 1?'complete':'notcomplete'}`}>
                <div className='status_detail'>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className='descript'>
                    <div>申请时间</div>
                    <div>申请处理中</div>
                    <div>到账时间</div>
                </div>
                <div className='apply_time'>
                    <div>{startTime}</div>
                    <div>金额<span>{applyMoney}</span>元</div>
                    <div>{endTime}</div>
                </div>
            </li>
        )
    }
}


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recordList:[]
        }
       
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let newDate = new Date()
            let nowTime = newDate.getFullYear()+'-'+(newDate.getMonth()+1);
            let data = nextProps.state.data;
            if (data&&data.data) {
                let num = 0;
                let inform = data.data.balance_list;
                for(let key in inform){
                    this.state.recordList[num] = {};
                    if (key == nowTime) {
                        this.state.recordList[num]['month'] = '本月';
                    }else{
                        this.state.recordList[num]['month'] = key.replace('-','年')+'月';
                    }
                    this.state.recordList[num]['totalMoney'] = inform[key].month_money;
                    this.state.recordList[num]['applyList'] = [];
                    inform[key].data.forEach((item,index) => {
                        this.state.recordList[num]['applyList'][index] = {};
                        let start = item.created_at.split(':');
                        this.state.recordList[num]['applyList'][index]['startTime'] = start[0] + ':' + start[1];
                        this.state.recordList[num]['applyList'][index]['endTime'] = item.to_account_time.split(' ')[0];
                        this.state.recordList[num]['applyList'][index]['applyMoney'] = item.money;
                        this.state.recordList[num]['applyList'][index]['status'] = item.to_account_status;
                    })
                    num++;
                }
            }
        }     
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        return (
            <div className='apply_container component_container'>
                <Header goback title='提现记录'/>
                {
                  this.state.recordList.length > 0 ? <List list={this.state.recordList}/> : <div>
                    <div className='empty_img'></div>
                    <div className='empty_text'>穷鬼，还不快去卖货！</div>
                  </div>
                }
            </div>
        );
    }
}


export default template({
    id: 'applyRecord',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/shopro/data/applyrecord.json',
    data: () => { //发送给服务器的数据
        return {
           year:2016
        }
    }
});

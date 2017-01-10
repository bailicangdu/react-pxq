import React, { Component, PropTypes } from 'react';
import pureRender from 'pure-render-decorator';
import { History, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import { Tool } from '../Config/Tool';
import {Header, template} from './common/mixin';


class List extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        return (
            <div> 
                <ul className="product_list_ul">
                    {
                        this.props.list.map((item, index) => {
                            return <ListItem key={index} {...item} index={index}/>
                        })
                    }
                </ul>
            </div>
        );
    }
}


class ListItem extends Component {
    static contextTypes = {
        recordState:React.PropTypes.any,
        store:React.PropTypes.any
    }

    constructor(props,context){
        super(props,context)
        this.state = {
            productCount:this.props.num,
            chooseState:this.props.chooseState,
        }
        this.getProductCount = (type) => {  // 商品数量加减时进行计算
            if (this.state.chooseState) {
                let num = this.state.productCount;
                if (type == 'reduce'&&num > 0) {
                    num = num - 1;
                    this.setState({
                        productCount: num
                    });
                }else if (type == 'add') {
                    num = num + 1;
                    this.setState({
                        productCount: num
                    });
                }
                this.context.recordState(this.props.id,this.state.chooseState,num,this.props.index)
            }
        }

        this.handleChange = (event) => {  // input值改变的时候进行判断赋值  
            if(this.state.chooseState){
                let newValue = event.target.value;
                newValue = Number(newValue.replace((/\D+/gi),''));
                this.setState({ 
                    productCount:newValue
                });
                this.context.recordState(this.props.id,this.state.chooseState,newValue,this.props.index)
            }
        }

        this.changeState = () => {
            let state = !this.state.chooseState;
            this.setState({chooseState:state})
            this.context.recordState(this.props.id,state,this.state.productCount,this.props.index)
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        let {productName,id} = this.props;
        let productCount = this.state.productCount;
        return (
            <li className='chooseProduct_item clear'>
                <div className={`chooseItem_left ellips left ${this.state.chooseState == true ? 'choosed':''}`} onClick={this.changeState}> {productName}</div>
                <div className='chooseItem_right right'>
                    <button disabled={productCount > 0 ? '':'disabled'} className={`${productCount > 0 ? 'reduce':'reduce_no'} button_style `} onClick={this.getProductCount.bind(this,'reduce')}></button>
                    <input type='text' className='product_num' maxLength='5' value={productCount} onChange={this.handleChange}/>
                    <button className='add button_style' onClick={this.getProductCount.bind(this,'add')}></button>
                </div>
            </li>
        );
    }
}



class Main extends Component {
    static childContextTypes = {
        recordState:React.PropTypes.any
    }

    constructor(props,context) {
        super(props,context);
        this.state = {
            productList:[],     //商品列表
            params:'',          //传入的参数
            shouldUpdata:false, //组件是否需要更新
            left:0,
            num:0,
            director:-1,
            requestID:null,
            clientWidth:0,
            moving:false,
        }

        this.productsState = (id,chooseState,num,index) => {

            this.state.productList[index].chooseState = chooseState;
            this.state.productList[index].num = num;
            this.props.saveProductlist(this.state.productList)

        }

        this.move = () => { // 做个动画效果试试
            this.state.clientWidth = document.documentElement.clientWidth;
            this.state.director = this.state.director*(-1)
            cancelAnimationFrame(this.state.requestID)
            this.getMove();
            this.state.moving = true;
        }
        
        this.getMove = () => {
            this.state.requestID = requestAnimationFrame(() => {
                this.state.num = this.state.director*4 + this.state.num;
                this.setState({left:this.state.num+'px'})
                if (this.state.num >= this.state.clientWidth - 100 ) {
                    this.state.director = this.state.director*(-1)
                }else if (this.state.num <= 0) {
                    this.state.director = this.state.director*(-1)
                }
                this.getMove()
            })
        }
        
    }

    getChildContext(){
        return{
            recordState:this.props.recordState
        }
    }

    componentWillReceiveProps(nextProps){
        this.state.shouldUpdata = false;
        if (this.props !== nextProps) {
            let data = nextProps.state.data;
            if (nextProps.producRecord.productList&&this.state.productList.length == 0) {
                this.state.shouldUpdata = true;
                this.state.productList = nextProps.producRecord.productList;
            }else if (data&&data.data&&data.data.data&&this.state.productList.length == 0) {
                this.state.shouldUpdata = true;
                let list = data.data.data;
                this.props.newProductData(list);
                list.forEach((item,index)=>{
                    this.state.productList[index] = {};
                    this.state.productList[index]['productName'] = item.product_name;
                    this.state.productList[index]['chooseState'] = false;
                    this.state.productList[index]['id'] = item.product_id;
                    this.state.productList[index]['num'] = 1;
                })
            }

            if(nextProps.producRecord.id){
                let {producRecord} = nextProps;
                this.productsState(producRecord.id,producRecord.chooseState,producRecord.num,producRecord.index)
            }
        }     
    }

    componentWillUpdate(nextProps, nextState) {
        
    }

    componentWillMount(){
        this.state.params = this.props.location.search;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps))||!is(fromJS(this.state),fromJS(nextState)) && (this.state.shouldUpdata || this.state.moving)
    }
    
    componentWillUnmount(){
        cancelAnimationFrame(this.state.requestID);
    }
    render() {
        let MoveDiv = {position:'fixed',backgroundColor:'red',height:'100px',width:'100px',zIndex:99999,left:this.state.left,bottom:'0'};
        return (
            <div className="component_container">
                {/*<div style={MoveDiv} onClick={this.move}></div>*/}
                <Header goback title='销售商品' save params={this.state.params} />
                {
                  this.state.productList.length > 0 ? <List list={this.state.productList}/> : null
                }
            </div>
        );
    }
}

export default template({
    id: 'chooseProducts',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/shopro/data/products.json'
});

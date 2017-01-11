import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import {History, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {Header,template} from './common/mixin';


class Main extends Component {
    constructor() {
        super();
        this.state = {
            saleMoney:'',  //销售金额
            name:'',   //姓名
            phone:'',   //电话
            products:[],    //销售商品
            postProduct:[], //上传的商品信息
            serverId:'',   // 图片id
            picSrc:'',     //图片src
            saleOldvalue:'',    //金额上次input值
            preventMountSubmit:true,//防止重复提交
        }

        this.changeValue = (type,event) => {
            if (type === 'money') {
                let value = event.target.value;
                if((/^\d*?\.?\d{0,2}?$/gi).test(value)){
                    if ((/^0+[1-9]+/).test(value)) {
                        value = value.replace(/^0+/,'');
                    }
                    if ((/^0+0\./).test(value)) {
                        value = value.replace(/^0+/,'0');
                    }
                    value = value.replace(/^\./gi,'0.');
                    this.state.saleOldvalue = value;
                    this.state.inputLength = value.length;
                }else{
                      value = this.state.saleOldvalue;
                }
                this.setState({
                    saleMoney:value
                })
            }else if (type === 'name') {
                this.setState({
                    name:event.target.value
                })
            }else if(type === 'phone'){
                let value = event.target.value.replace(/\D/gi,'')
                this.setState({
                    phone:value
                })
            }
        }

        this.chooseImage = () => {
            Tool.alert('测试环境无法获取微信签名');
            let self = this;
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: res => {
                    let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    self.setState({picSrc:localIds});
                    self.uploadImage(localIds)
                }
            });

        }

        this.uploadImage = (localIds) => {
            let self = this;
            localIds = localIds.toString()
            wx.uploadImage({
                localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: res => {
                    let serverId = res.serverId; // 返回图片的服务器端ID
                    self.setState({serverId:serverId});
                }
            });
        }

        this.postInform = () => {
            if (this.state.saleMoney == '') {
                Tool.alert('请输入订单金额');
            }else if (this.state.name == '') {
                Tool.alert('请输入客户姓名');
            }else if (this.state.phone == ''||!/^1\d{10}$/.test(this.state.phone)) {
                Tool.alert('请输入正确的电话号码');
            }else if (this.state.postProduct.length == 0) {
                Tool.alert('请选择销售的产品');
            }else if (this.state.picSrc !== ''&&this.state.serverId == '') {
                Tool.alert('图片上传失败，请重新上传图片');
            }else if (this.state.serverId == '') {
                Tool.alert('请上传售卖发票凭证');
            }else{
                if (this.state.postProduct instanceof Object) {
                    this.state.postProduct = JSON.stringify(this.state.postProduct);
                }
                if (this.state.preventMountSubmit) {
                    this.state.preventMountSubmit == false;
                    this.props.getData('/sales/sales/input',{sales_money:this.state.saleMoney,customers_name :this.state.name,customers_phone :this.state.phone,products :this.state.postProduct,invoice_ids :this.state.serverId},(res) => {
                        if (res.http_code == 200) {
                            Tool.alert(res.data.msg);
                            this.setState({
                                saleMoney:'',
                                name:'',
                                phone:'',
                                products:[],
                                serverId:'',
                                picSrc:'',
                                postProduct:[],
                                preventMountSubmit:true
                            })
                        }else{
                            this.state.preventMountSubmit = true;
                            Tool.alert(res.msg)
                        }
                    },'input')
                }
            }
        }

        this.deleteImg = () => {
            this.setState({picSrc:'',serverId:''})
        }  
        
    }

    componentWillMount() {
        let params = this.props.location.query;
        if (this.props.producRecord.productList&&this.props.location.search!=='') {
            let {productList} = this.props.producRecord;
            let num = 0;
            productList.forEach((item,index) => {
                if (item.chooseState&&item.num>0) {
                    this.state.products[num] = [item.productName,item.num.toString()];
                    this.state.postProduct[num] = {};
                    this.state.postProduct[num]['id'] = item.id;
                    this.state.postProduct[num]['quantity'] = item.num;
                    num++;
                }
            })
        }
        this.state.saleMoney = params.saleMoney||'';
        this.state.name = params.name||'';
        this.state.phone = params.phone||'';
        this.state.picSrc = params.picSrc||'';
        this.state.serverId = params.serverId||'';
    }
    componentDidMount() {
        const url = window.location.href.split('#')[0];
        const successFun = (res) => {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: res.appId, // 必填，公众号的唯一标识
                timestamp: res.timestamp, // 必填，生成签名的时间戳
                nonceStr: res.nonceStr, // 必填，生成签名的随机串
                signature: res.signature, // 必填，签名，见附录1
                jsApiList: ['chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }

        //this.props.getData('core/wx/jssdkNotLogin', {url: url}, successFun, 'jssdk');
        //获取微信签名，demo不需要
        wx.ready(() => {
            wx.hideOptionMenu();
        })    
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    componentWillUpdate(nextProps,nextState){
        if (this.props !== nextProps) {
            let {data} = nextProps.state;

        }
    }
   
    render() {
        let products = this.state.products;
        return (
            <div className="component_container index_module">
                
                <Header nav saleRecord title='销售录入'/>
                <div className='index_tip'>
                    <span className='tip_text'>请录入您的销售业绩</span>
                </div>

                <form className='form_style'>
                    <div className='input_container'>
                        <span className='input_descript'>销售金额：</span>
                        <input type="text" value={this.state.saleMoney} placeholder='请输入订单金额' onChange={this.changeValue.bind(this,'money')}/>
                    </div>
                    <div className='input_container'>
                        <span className='input_descript'>客户姓名：</span>
                        <input type="text" value={this.state.name} placeholder='请输入客户姓名' onChange={this.changeValue.bind(this,'name')}/>
                    </div>
                    <div className='input_container'>
                        <span className='input_descript'>客户电话：</span>
                        <input type="text" maxLength='11' value={this.state.phone} placeholder='请输入客户电话' onChange={this.changeValue.bind(this,'phone')}/>
                    </div>
                </form>

                <div className='index_tip'>
                    <span className='tip_text'>请选择销售的产品</span>
                </div>

                <div className='choose_product'>
                    <Link to={'/chooseProducts?saleMoney='+this.state.saleMoney+'&name='+this.state.name+'&phone='+this.state.phone+'&picSrc='+this.state.picSrc+'&serverId='+this.state.serverId} className={products.length > 0 ? 'showIcon':'link_choose'}>{products.length > 0 ? '':'请选择销售的产品'}</Link>
                    <ul  className={`choosed_ul clear ${products.length > 0 ? 'show':'hide'}`}>
                        {
                            products.length > 0 ?products.map((item,index) => {
                                return <li key={index} className='product_li left'>
                                    <span className='product_style product_name ellips' style={{maxWidth:`${4.8-item[1].length*0.6}rem`}}>{item[0]}</span>
                                    <span className='product_style'>x</span>
                                    <span className='product_style'>{item[1]}</span>
                                </li>
                            }):null
                        }
                    </ul>
                </div>

                <div className='index_tip'>
                    <span className='tip_text'>请上传售卖发票凭证</span>
                </div>
                {
                    this.state.picSrc !== ''?<div className='img_container'>
                        <span className='delet_img' onClick={this.deleteImg}></span>
                        <img src={this.state.picSrc} className='chooseImg'/>
                    </div>:<div className='choosePic' onClick={this.chooseImage}>
                    <span className='choose_button'>请点击上传凭证</span>
                </div>
                }
                
                <div className='submit' onClick={this.postInform}>
                    提交
                </div>
            </div>
        )
    }
    
    componentWillUnmount() {
        cancelAnimationFrame(this.state.requestID);
    }
}

export default template({
    id: 'index',  //应用关联使用的redux
    component: Main,//接收数据的组件入口
    url: ''
});


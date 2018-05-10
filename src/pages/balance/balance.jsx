import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import PublicHeader from '@/components/header/header';
import TouchableOpacity from '@/components/TouchableOpacity/TouchableOpacity';
import PublicAlert from '@/components/alert/alert';
import API from '@/api/api';
import './balance.less';

class BrokeRage extends Component{
  state = {
    applyNum: '', //输入值
    alertStatus: false, //弹框状态
    alertTip: '', //弹框提示文字
    balance: {  //可提现金额
      balance: 0, 
    },
  }
  // 初始化数据
  initData = async () => {
    try{
      let result = await API.getBalance();
      console.log(result);
      this.setState({balance: result});
    }catch(err){
      console.error(err);
    }
  }
  
  /**
   * 格式化输入数据
   * 格式为微信红包格式：最大 200.00
   * @param  {object} event 事件对象
   */
  handleInput = event => {
    let value = event.target.value;
    if((/^\d*?\.?\d{0,2}?$/gi).test(value)){
      if((/^0+[1-9]+/).test(value)) {
        value = value.replace(/^0+/,'');
      }
      if((/^0{2}\./).test(value)) {
        value = value.replace(/^0+/,'0');
      }
      value = value.replace(/^\./gi,'0.');
      if(parseFloat(value) > 200){
        value = '200.00';
      }
      this.setState({applyNum: value});
    }
  }
  
  /**
   * 提交判断条件
   */
  sumitForm = () => {
    let alertTip;
    if(!this.state.applyNum){
      alertTip = '请输入提现金额';
    }else if(parseFloat(this.state.applyNum) > this.state.balance.balance){
      alertTip = '申请提现金额不能大于余额';
    }else{
      alertTip = '申请提现成功';
    }

    this.setState({
      alertStatus: true,
      alertTip,
      applyNum: '',
    })
  }
  
  /*
  关闭弹框
   */
  closeAlert = () => {
    this.setState({
      alertStatus: false,
      alertTip: '',
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
  }

  componentDidMount(){
    this.initData();
  }

  render(){
    return (
      <main className="home-container">
        <PublicHeader title='提现' record />
        <section className="broke-main-content">
          <p className="broke-header">您的可提现金额为：¥ {this.state.balance.balance}</p>
          <form className="broke-form">
            <p>请输入提现金额（元）</p>
            <p>¥ <input type="text" value={this.state.applyNum} placeholder="0.00" onInput={this.handleInput} maxLength="5" /></p>
          </form>
          <TouchableOpacity className="submit-btn" clickCallBack={this.sumitForm} text="申请提现" />
        </section>
        <PublicAlert closeAlert={this.closeAlert} alertTip={this.state.alertTip} alertStatus={this.state.alertStatus} />
      </main>
    );
  }
}

export default BrokeRage;

import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {Header, template} from './common/mixin';

/**
 * (导出组件)
 * 
 * @export
 * @class Main
 * @extends {Component}
 */


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          allDeposit: 0,  //可提现总额
          inputMoney: '',  //输入的金额
          oldValue: '',  //上次输入的金额
          inputLength: 0,  //根据输入数字长短，改变输入框宽度
        }

        this.handleChange = (event) => {
          let value = event.target.value;
          if((/^\d*?\.?\d{0,2}?$/gi).test(value)){
              if ((/^0+[1-9]+/).test(value)) {
                value = value.replace(/^0+/,'');
              }
              if ((/^0+0\./).test(value)) {
                value = value.replace(/^0+/,'0');
              }
              value = value.replace(/^\./gi,'0.');
              this.state.oldValue = value;
              this.state.inputLength = value.length;
          }else{
              value = this.state.oldValue;
          }
          if (value.indexOf('.') > -1) {
            let startIndex = value.indexOf('.')

          }
          this.setState({
            inputMoney:value
          })

        }

        this.postInform = () => {

          let inputMoney = this.state.inputMoney !==''?parseFloat(this.state.inputMoney):0;
          if (inputMoney > 200) {
            Tool.alert('每笔提现金额不超过200元')
          }else if (inputMoney > parseFloat(this.state.allDeposit)) {
            Tool.alert('您的提现金额超出余额')
          }else if(inputMoney <= 0){
            Tool.alert('请输入提现金额')
          }else{
            this.props.getData('/shopro/data/applysuccess',{money:inputMoney},(res) => {
                if (res.http_code == 200) {
                    Tool.alert('您的提现申请已提交成功！','款项将于5-7个工作日转入您的微信钱包');
                    let deposit = this.state.allDeposit - inputMoney;
                    deposit = deposit.toString();
                    if (/\./gi.test(deposit)) {
                      deposit = parseFloat(deposit);
                      deposit = deposit.toFixed(2);
                    }
                    deposit = parseFloat(deposit); 
                    this.setState({
                      inputMoney:'',
                      allDeposit:deposit
                    })
                }else{
                    Tool.alert(res.data.msg)
                }
            },'applyRecord')
          }
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
          let data = nextProps.state.data;
          if (data&&data.data&&data.data.data) {
            this.state.allDeposit = data.data.data.balance||0;
          }
        }     
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }

    render() {
        let inputLength = this.state.inputLength > 4?(this.state.inputLength-4):0;
        return (
            <div>
               <Header nav title='余额提现'  applyRecord />
               <div className='apply_tip'>您的可提现金额为：¥ {this.state.allDeposit}</div>
               <div className='deposit_detail'>
                 <div className='detail_tip'>请输入提现金额（元）</div>
                 <div className='detail_num'><span><input maxLength='6'  type="text" className='input_money' value={this.state.inputMoney} style={{width:`${2.8+inputLength*0.7}rem`}}  onChange={this.handleChange}/></span></div>
               </div>
               <button className='trans_apply' onClick={this.postInform}>申请提现</button>
               <div className='apply_rule'>
                 <p>1、申请提现的奖金将存入您的微信钱包；</p>
                 <p>2、申请提现款项将于5-7工作日到账；</p>
                 <p>3、每笔提现金额不超过200元，每天最多三次。</p>
               </div>
            </div>
        );
    }

}


export default template({
    id: 'applyDeposit',  //应用关联使用的redux
    component: Main,
    url: '/shopro/data/applybalance'
});

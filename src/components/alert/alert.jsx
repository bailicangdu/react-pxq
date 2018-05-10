import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { is, fromJS } from 'immutable';
import TouchableOpacity from '@/components/TouchableOpacity/TouchableOpacity';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './alert.less';

export default class Alert extends Component{
  static propTypes = {
    closeAlert: PropTypes.func.isRequired,
    alertTip: PropTypes.string.isRequired,
    alertStatus: PropTypes.bool.isRequired,
  }
  // css动画组件设置为目标组件
  FirstChild = props => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
  }
  // 关闭弹框
  confirm = () => {
    this.props.closeAlert();
  }
  
  shouldComponentUpdate(nextProps, nextState){
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }
  
  render(){
    return (
      <ReactCSSTransitionGroup
        component={this.FirstChild}
        transitionName="alert"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {
          this.props.alertStatus&&<div className="alert-con">
            <div className="alert-context">
              <div className="alert-content-detail">{this.props.alertTip}</div>
              <TouchableOpacity className="confirm-btn" clickCallBack={this.confirm}/>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { is, fromJS } from 'immutable';
import './TouchableOpacity.css';
/**
 * 点击状态组件
 */
export default class TouchableOpacity extends Component{
  static propTypes = {
    clickCallBack: PropTypes.func,
    text: PropTypes.string,
    className: PropTypes.string,
  }
  
  handleTouchStart = () => {
    this.refs.btn.style.opacity = '0.3';
  }

  handleTouchEnd = () => {
    this.refs.btn.style.opacity = '1';
    this.props.clickCallBack();
  }

  shouldComponentUpdate(nextProps, nextState){
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }
  
  render(){
    return (
      <div className={`btn-con ${this.props.className}`} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} ref='btn'>{this.props.text||'确认'}</div>
    );
  }
}
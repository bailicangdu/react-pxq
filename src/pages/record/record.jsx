import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import PublicHeader from '@/components/header/header';
import RecordList from './components/recordList';
import './record.css';

class Record extends Component {
  state = {
    flagBarPos: '17%',
  }
  /**
   * 设置头部底部标签位置
   * @param  {string} type 数据类型
   */
  setFlagBarPos = type => {
    let flagBarPos;
    switch(type){
      case 'passed':
        flagBarPos = '17%';
      break;
      case 'audited':
        flagBarPos = '50%';
      break;
      case 'failed':
        flagBarPos = '83%';
      break;
      default: 
        flagBarPos = '17%';
    }
    this.setState({flagBarPos})
  }

  componentWillReceiveProps(nextProps){
    // 属性变化时设置头部底部标签位置
    let currenType = this.props.location.pathname.split('/')[2];
    let type = nextProps.location.pathname.split('/')[2];
    if(currenType !== type){
      this.setFlagBarPos(type);
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }
  
  componentWillMount(){
    // 初始化设置头部底部标签位置
    let type = this.props.location.pathname.split('/')[2];
    this.setFlagBarPos(type);
  }
  render() {
    return (
      <main className="common-con-top">
        <PublicHeader title='记录' />
        <section className="record-nav-con">
          <nav className="record-nav">
            <NavLink to={`${this.props.match.path}/passed`} className="nav-link">已通过</NavLink>
            <NavLink to={`${this.props.match.path}/audited`} className="nav-link">待审核</NavLink>
            <NavLink to={`${this.props.match.path}/failed`} className="nav-link">未通过</NavLink>
          </nav>
          <i className="nav-flag-bar" style={{left: this.state.flagBarPos}}></i>
        </section>
        {/* 子路由在父级配置，react-router4新特性，更加灵活 */}
        <Switch>
          <Route path={`${this.props.match.path}/:type`} component={RecordList} />
          <Redirect from={`${this.props.match.path}`} to={`${this.props.match.path}/passed`} exact component={RecordList} />
        </Switch>
      </main>
    );
  }
}

export default Record;

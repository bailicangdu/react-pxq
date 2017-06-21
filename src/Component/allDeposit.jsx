import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import {Tool} from '../Config/Tool';
import {Header, template} from './common/mixin';



class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
          allDeposit: 0  
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            let {data} = nextProps.state;
            if (data&&data.data&&data.data.data) {
                this.state.allDeposit = data.data.data.balance||0;
            }
        }     
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        return (
            <div>
               <Header nav title='提现'  applyRecord />
               <div className='deposit_tip'>每笔提现金额不超过200元，每天最多3次</div>
               <div className='deposit_detail'>
                 <div className='detail_tip'>可提现金额（元）</div>
                 <div className='detail_num'><span>{this.state.allDeposit}</span></div>
               </div>
               <Link to={'/applyDeposit?allDeposit='+this.state.allDeposit} className='trans_apply'>提现</Link>
            </div>
        );
    }
}


export default template({
    id: 'allDeposit',  //应用关联使用的redux
    component: Main,
    url: '/shopro/data/balance'
});

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { is } from 'immutable';
import *as action from '../../Redux/Action/Index';

const Main = (mySeting) => {
    let seting = {
        id: '', //应用唯一id表示
        url: '', //请求地址
        data: null, //发送给服务器的数据
        component: <div></div>, //数据回调给的组件
    };

    for (let key in mySeting) {
        seting[key] = mySeting[key];
    }


    class Index extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            let state = {data:this.props.state.get('data'),isFetching:this.props.state.get('isFetching')}
            let saleRecord = {index:this.props.saleRecord.get('index')};
            return <this.props.seting.component {...this.props} state={state} saleRecord={saleRecord} />;
        }

        componentDidMount() {//获取数据
            this.props.fetchPosts(this.props.seting.url,this.props.seting.data);
        }

        componentWillReceiveProps(nextProps) {
            //console.log(nextProps)
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.state.get('isFetching')) {
                return false
            }
            return !(this.props === nextProps || is(this.props, nextProps)) ||!(this.state === nextState || is(this.state, nextState));
        }
    }

    Index.defaultProps = { seting }
    //mapStateToProps and mapDispatchToProps
    return connect(state => { 
        let {producRecord, saleRecord,requestData} = state;
        return { 
            state: state['fetchData'],
            producRecord ,
            saleRecord ,
            requestData ,
        } 
    }, action)(Index); //连接redux
}


export default Main;
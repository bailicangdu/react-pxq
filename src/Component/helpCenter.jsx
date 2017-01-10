import React, {Component, PropTypes} from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { is, fromJS} from 'immutable';
import { Header,template} from './common/mixin';


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
          toggleList:'none',  //右侧商品列表是否展示
          selected:{list1:'rule_active'}, // 当前选择的商品为选中状态
          oldSelected:'list1', // 上次选中的商品，避免多次选择
          content:'', // 当前选商品的内容
          data:[], // 获取到的数据
          showList:[], // 左侧显示出来的商品列表
          hideList:[], // 右侧隐藏的商品列表
          widthRate:null, // 左侧商品列表的宽度，根据获得长度的不同，宽度会跟随变化
          liWidth:null, //  左侧单个商品列表的宽度
          aside:null, // 右侧列表的对象
        }
        this.showHide = (type) => { //下拉列表是否显示
          if (type === 'none') {
            this.setState({toggleList:'none'})
          }else if (this.state.toggleList === 'none') {
            this.setState({toggleList:'block'})
          }else{
            this.setState({toggleList:'none'})
          }
        }
        this.toggleSelect = (index,event) => {  //确定当前选中的商品
          let name = event.target.getAttribute('name');
          if (this.state.oldSelected !== name) {
            this.state.content = this.state.data[index].content||'';
            this.state.selected = {};
            this.state.selected[name] = 'rule_active';
            this.setState(this.state.selected);
            this.state.oldSelected = name;
          }
        }
    }
    componentWillUpdate(nextProps, nextState) {
      if (this.props !== nextProps) {  //判断props是否更新，将不随状态改变而变化的变量放入此处，防止多次赋值
        let {data} = nextProps.state;
        if (data) {
          let newData = [];
          data.data.data.forEach((item,index) => {
            newData[index] = {};
            newData[index]['title'] = item.title;
            newData[index]['content'] = item.introduce;
          })
          this.state.data = newData;
          this.state.content = newData[0].content;
        }

        if (this.state.data.length > 3) {
          this.state.hideList = this.state.data.splice(3,this.state.data.length);
          this.state.showList = this.state.data;
          this.state.data = this.state.showList.concat(this.state.hideList);
          this.state.widthRate = '87%';
          this.state.liWidth = '33.3%'
          
        }else{
          this.state.widthRate = '100%';
          this.state.liWidth = 100/this.state.data.length + '%';
          this.state.showList = this.state.data;
        }
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    
    render() {
        if (this.state.data.length > 3) {
          this.state.aside = (<aside className='right rule_aside' onClick={this.showHide}>
                     <ul className='rule_hide' style={{display:this.state.toggleList}}>
                        {
                          this.state.hideList.map((item , index) => {
                            return <li key={index}  onClick={this.toggleSelect.bind(this,index+3)}><span></span><p name={'list'+ (Number(index) + 4)} >{item.title}</p></li>
                          })
                        }
                     </ul>
                 </aside>)
        }else{
           this.state.aside = null;
        }
        if (this.refs.context != undefined) {
          this.refs.context.innerHTML = this.state.content;
        }
        
        return (
            <div>
               <Header nav title='帮助中心' HideList={this.showHide}/>
               <nav className='rule_nav'>
                   <ul className='left rule_name' style={{width:this.state.widthRate}} onClick={this.showHide.bind(this,'none')}>
                   {
                      this.state.showList.length > 0 ? this.state.showList.map((item , index) => {
                        return <li key={index} style={{width:this.state.liWidth}} className={this.state.selected['list' + (Number(index) +1)]}><span onClick={this.toggleSelect.bind(this,index)} name={'list'+ (Number(index) + 1)}>{item.title}</span> </li> 
                      }) : null
                   }  
                   </ul>
                  {this.state.aside}
               </nav>
               <section className='rule_content' ref='context' onClick={this.showHide.bind(this,'none')}>
               </section>
            </div>
        );
    }
}


export default template({
    id: 'helpCenter',  //应用关联使用的redux
    component: Main, //接收数据的组件入口
    url: '/shopro/data/policylist.json'
});

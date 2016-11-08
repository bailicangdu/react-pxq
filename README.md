## 技术栈：
react + react-router + redux + immutable + less + ES6 + webpack + fetch + 按需加载 + webpack-dev-server反向代理 + 调用微信相机和相册接口


## 下载

 	git clone https://github.com/bailicangdu/pxq.git

 	cd pxq

 	npm install 

 	npm install webpack -g 


## 运行（nodejs 6.0+）
```
 npm run dev (开发版本访问：http://localhost:8080/)
  
 npm run dist （发布生产版本）
```

## 总结：
```
一、Virtual DOM是react的标志。虚拟DOM之所以快有两点原因：1、Javascript运行很快  2、操作真实DOM很慢。
DOM操作起来很慢很耗CPU，所以react将DOM直接写进js，再也没有html文件，所有的DOM都在js中生成并渲染。
我们不需要控制DOM如何生成如何渲染，react已经替我们做好了一切，我们只需要告诉它想要的效果，它会用最好的方法将效果渲染出来。

二、Redux是个数据管理中心，它主要的作用是实现组件之间的通信。当react组件结构树庞大，交互复杂，
组件之间的通信将会非常麻烦，因为react是单向数据流，只能通过props传入子组件，如果向上传递必须特殊处理。
redux相当于在react的最顶层加了一个数据层，所有需要共用的数据放在这里统一管理。如果项目组件不多，逻辑不复杂，redux可以不用。

三、ES6很强大，并且经过babel转换后兼容性很好。

四、webpack可以极大的提高工作效率，各种需要的功能都有，尤其是webpack-dev-server中proxy的反向代理，
实现前后端分离开发，很实用。

五、immutable定义了一种数据类型，一旦定义就不能更改，所有对数据的操作都会生成一个新的数据。
它可以极大的提高react的速度，但是它改变了数据结构，容易坑。demo是在写完之后才加上immutable，
所以每次改变以前的state为immutable，都会影响其他的数据变化，很麻烦。

六、fetch是ajax最新替代技术。ajax基于事件而fetch基于Promise，更加友好，更近符合现代发展趋势。

七、还有很多需要修改的地方，接下来会慢慢完善。
```

## 推荐一些好的文章和官方文档

1.[React 入门教程](http://uprogrammer.cn/react-tutorial-cn/)<br /> 
2.[Redux 中文文档](http://cn.redux.js.org/)<br />
3.[Immutable.js 官方文档](http://facebook.github.io/immutable-js/docs/)<br />    
4.[ES6入门教程](http://es6.ruanyifeng.com/)<br /> 
5.[React+Redux教程](http://www.cnblogs.com/lewis617/p/5145073.html)<br /> 
6.[React组件沟通的方法](http://www.alloyteam.com/2016/01/some-methods-of-reactjs-communication-between-components/)<br /> 
7.[React-router中文文档](http://www.uprogrammer.cn/react-router-cn/)<br /> 
8.[Webpack 中文指南](http://uprogrammer.cn/webpack-handbook/)<br />
9.[React实例 react-cnode](https://github.com/lzxb/react-cnode)<br />



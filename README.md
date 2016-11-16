## 技术栈：
1 react

2 redux

3 immutable

4 less

5 scss

6 ES6

7 webpack

8 fetch

9 webpack-dev-server反向代理

10 react-router按需加载

11 react-transform热替换


## 下载

 	git clone https://github.com/bailicangdu/pxq.git

 	cd pxq

 	npm install 

 	npm install webpack -g 


## 运行（nodejs 6.0+）
```
 npm run dev (正常编译模式)

 npm run hot (热替换编译模式)
  
 npm run dist （发布生产版本，对代码进行混淆压缩，提取公共代码，分离css文件）
```

## 总结：
```
一、Virtual DOM是react的标志。虚拟DOM之所以快有两点原因：1、Javascript运行很快  2、操作真实DOM很慢。
DOM操作起来很慢很耗CPU，所以react将DOM直接写进js，再也没有html文件，所有的DOM都在js中生成并渲染。
我们不需要控制DOM如何生成如何渲染，react已经替我们做好了一切，我们只需要告诉它想要的效果，它会用最好的方法将效果渲染出来。

二、Redux是个数据管理中心，它主要的作用是实现组件之间的通信。当react组件结构树庞大，交互复杂，
组件之间的通信将会非常麻烦，因为react是单向数据流，只能通过props传入子组件，如果向上传递必须特殊处理。
redux相当于在react的最顶层加了一个数据层，所有需要共用的数据放在这里统一管理。如果项目组件不多，逻辑不复杂，redux可以不用。
对于第一次接触redux的人，很多人第一感觉就是懵，不知道如何下手，文档看了一遍，似乎看懂了，还是不知道该怎么写。
那种和react关系密切但是又似乎没有关系的感觉让人特别不舒服。redux上手的确是有点难的，如果受不了reudx，推荐使用
mobx，这是新出的一个库，功能类似redux，优点是上手特别简单，而且不需要像redux一样做太多的优化。

三、ES6很强大，并且经过babel转换后兼容性很好。

四、webpack可以极大的提高工作效率，各种需要的功能都有，尤其是webpack-dev-server中proxy的反向代理，
实现前后端分离开发，很实用。

五、immutable定义了一种数据类型，一旦定义就不能更改，所有对数据的操作都会生成一个新的数据。
它可以极大的提高react的速度，对比方式很简单，

六、fetch是ajax最新替代技术。ajax基于事件而fetch基于Promise，更加友好，更近符合现代发展趋势。

七、11月14日新增热替换功能，局部替换修改的状态，不用刷新页面，提高开发效率。部分less文件改成sass文件，
对比两种css预编译工具，感觉差别不大。

```

## 11月14日新增热替换功能




## 技术栈：
react + redux + immutable + less + ES6 + webpack + fetch + webpack-dev-server反向代理 + react-router按需加载 + react-transform热替换


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


## 2016年11月14日
```
新增热替换功能
```
##2016年11月16日
```
添加immutable.js的使用，减少组件不必要的更新，优化性能
```



#总结

##做react需要会什么？
刚开始做项目的时候以为会来react和redux就足够了，可是事实总是喜欢打脸。之前我一直用angular，它的特点是大而全，只需要用到angular，就能进行开发，有一种葵花在手，天下我有的感觉。但是react就不一样了，他就负责ui渲染，想要做好一个项目，得会用redux来管理数据，还得会es6，webpack还得懂一点，要想提高性能，需要按需加载，immutable.js也得学一点，还有单元测试。。。。。


##react 是什么鬼？
用脚本进行DOM操作的代价很昂贵。有个贴切的比喻，把DOM和JavaScript各自想象为一个岛屿，它们之间用收费桥梁连接，js每次访问DOM，都要途径这座桥，并交纳“过桥费”,访问DOM的次数越多，费用也就越高。 因此，推荐的做法是尽量减少过桥的次数，努力待在ECMAScript岛上。因为这个原因react的虚拟dom就显得难能可贵了，它创造了虚拟dom并且将它们储存起来，每当状态发生变化的时候就会创造新的虚拟节点和以前的进行对比，让变化的部分进行渲染。整个过程和以前的js获取dom节点，操作节点相比，只有一个渲染的过程，所以react就是一个ui框架。


##react的组件化

react组件是将数据和视图结合起来，也就是mvc中的mv。react将dom写进了js并和state结合形成了一个组件，组件以功能为划分，许多小的组件组成一个大的组件，整个项目就是由一个个组件组合而成。它的好处是利于重复利用和维护。




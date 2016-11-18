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

##react 是什么鬼？
用脚本进行DOM操作的代价很昂贵。有个贴切的比喻，把DOM和JavaScript各自想象为一个岛屿，它们之间用收费桥梁连接，js每次访问DOM，都要途径这座桥，并交纳“过桥费”,访问DOM的次数越多，费用也就越高。 因此，推荐的做法是尽量减少过桥的次数，努力待在ECMAScript岛上。因为这个原因react的虚拟dom就显得难能可贵了，它创造了虚拟dom并且将它们储存起来，每当状态发生变化的时候就会创造新的虚拟节点和以前的进行对比，让变化的部分进行渲染。整个过程和以前的js获取dom节点，操作节点相比，只有一个渲染的过程，所以react就是一个ui框架。





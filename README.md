## 技术栈：
react + redux + immutable + less + ES6 + webpack + fetch + webpack-dev-server反向代理 + react-router按需加载 + react-transform热替换


## 下载

 	git clone https://github.com/bailicangdu/pxq.git

 	cd pxq

 	npm install 


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


##react的 Diff算法
react的diff算法用在什么地方呢？当组件更新的时候，react会创建一个新的虚拟dom树并且会和之前储存的dom树进行比较，这个比较多过程就用到了diff算法，所以组件初始化的时候是用不到的。react提出了一种假设，相同的节点具有类似的结构，而不同的节点具有不同的结构。在这种假设之上进行逐层的比较，如果发现对应的节点是不同的，那就直接删除旧的节点以及它所包含的所有子节点然后替换成新的节点。如果是相同的节点，则只进行属性的更改。

对于列表的diff算法稍有不同，因为列表通常具有相同的结构，在对列表节点进行删除，插入，排序的时候，单个节点的整体操作远比一个个对比一个个替换要好得多，所以在创建列表的时候需要设置key值，这样react才能分清谁是谁。当然不写key值也可以，但这样通常会报出警告，通知我们加上key值以提高react的性能。

![](https://github.com/bailicangdu/pxq/blob/master/src/images/diff.png)




##react组件是怎么来的

组件的创造方法为React.createClass() ——创造一个类，react系统内部设计了一套类系统，利用它来创造react组件。但这并不是必须的，我们还可以用es6的class类来创造组件,这也是Facebook官方推荐的写法。

![](https://github.com/bailicangdu/pxq/blob/master/src/images/icon_class.png)

这两种写法实现的功能一样但是原理却是不同，es6的class类可以看作是构造函数的一个语法糖，可以把它当成构造函数来看，extends实现了类之间的继承 —— 定义一个类Main 继承React.Component所有的属性和方法，组件的生命周期函数就是从这来的。constructor是构造器，在实例化对象时调用，super调用了父类的constructor创造了父类的实例对象this，然后用子类的构造函数进行修改。这和es5的原型继承是不同的，原型继承是先创造一个实例化对象this，然后再继承父级的原型方法。了解了这些之后我们在看组件的时候就清楚很多。

当我们使用组件< Main />时，其实是对Main类的实例化——new Main，只不过react对这个过程进行了封装，让它看起来更像是一个标签。

有三点值得注意：1、定义类名字的首字母必须大写 2、因为class变成了关键字，类选择器需要用className来代替。 3、类和模块内部默认使用严格模式，所以不需要用use strict指定运行模式。




## 组件的生命周期

![](https://github.com/bailicangdu/pxq/blob/master/src/images/react-lifecycle.png)

**组件在初始化时会触发5个钩子函数：**

  **1、getDefaultProps()** 
> 设置默认的props，也可以用dufaultProps设置组件的默认属性。


  **2、getInitialState()**  
> 在使用es6的class语法时是没有这个钩子函数的，可以直接在constructor中定义this.state。此时可以访问this.props。


 **3、componentWillMount()** 
> 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。


 **4、 render()** 
>  react最重要的步骤，创建虚拟dom，进行diff算法，更新dom树都在此进行。此时就不能更改state了。


 **5、componentDidMount()** 
> 组件渲染之后调用，可以通过this.getDOMNode()获取和操作dom节点，只调用一次。


**在更新时也会触发5个钩子函数：**

  **6、componentWillReceivePorps(nextProps)**
> 组件初始化时不调用，组件接受新的props时调用。


  **7、shouldComponentUpdate(nextProps, nextState)** 
> react性能优化非常重要的一环。组件接受新的state或者props时调用，我们可以设置在此对比前后两个props和state是否相同，如果相同则返回false阻止更新，因为相同的属性状态一定会生成相同的dom树，这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，尤其是在dom结构复杂的时候。不过调用this.forceUpdate会跳过此步骤。


  **8、componentWillUpdata(nextProps, nextState)**
> 组件初始化时不调用，只有在组件将要更新时才调用，此时可以修改state


  **9、render()**
> 不多说


  **10、componentDidUpdate()**
> 组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。


还有一个卸载钩子函数

  **11、componentWillUnmount()** 
> 组件将要卸载时调用，一些事件监听和定时器需要在此时清除。


以上可以看出来react总共有10个周期函数（render重复一次），这个10个函数可以满足我们所有对组件操作的需求，利用的好可以提高开发效率和组件性能。

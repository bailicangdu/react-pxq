var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

var plugins = [];

//必须先定义好地址，如果直接写在对象里，可能会报错
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src'); //__dirname 中的src目录，以此类推
var APP_FILE = path.resolve(APP_PATH, 'app'); //根目录文件app.jsx地址
var BUILD_PATH = path.resolve(ROOT_PATH, 'pxq/dist'); //发布文件所存放的目录

if (process.argv.indexOf('-p') > -1) { //process.argv在run dist中是webpack --progress --colors --watch -p 所以indexof(-p)是指压缩，也就是说生产环境满足条件而编译环境不满足条件
    plugins.push(new webpack.DefinePlugin({ //编译成生产版本,定义一个插件，所以才有target = process.env.NODE_ENV !== 'production' ? '' : 'http://shopro.putaoevent.com'的比较
        //process.argv：当前进程的命令行参数数组。
        //process.env：指向当前shell的环境变量，比如process.env.HOME。
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
}

plugins.push(new ExtractTextPlugin('[name].css')); //css单独打包

plugins.push(new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
    filename: '../index.html', //生成的html存放路径，相对于 path
    template: './src/template/index.html' //, //html模板路径
        //hash: true,
            //为静态资源生成hash值
}));

plugins.push(new webpack.HotModuleReplacementPlugin())
plugins.push(new webpack.NoErrorsPlugin())

module.exports = {
    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            APP_FILE
        ]
    },
    output: {
        publicPath: '/pxq/dist/', //编译好的文件，在服务器的路径,这是静态资源引用路径
        path: BUILD_PATH, //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /^node_modules$/,
            loader: 'babel?presets=es2015',
            include: [APP_PATH]
        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer']),
            include: [APP_PATH]
        }, {
            test: /\.less/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'less']),
            include: [APP_PATH]
        }, {
            test: /\.scss$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer', 'sass']),
            include: [APP_PATH]
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /^node_modules$/,
            loader: 'file-loader?name=[name].[ext]',
            include: [APP_PATH]
        }, {
            test: /\.(png|jpg)$/,
            exclude: /^node_modules$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]', //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            include: [APP_PATH]
        }, {
            test: /\.jsx$/,
            exclude: /^node_modules$/,
            loaders: ['jsx', 'babel?presets[]=es2015,presets[]=react'],
            include: [APP_PATH]
        }]
    },
    plugins,
    resolve: {
        extensions: ['', '.js', '.jsx'], //后缀名自动补全
    }
};
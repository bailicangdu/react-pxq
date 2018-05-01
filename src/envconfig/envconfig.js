/**
 * 全局配置文件
 */
let baseURL; 
let imgUrl = 'http://elm.cangdu.org/img/';
if(process.env.NODE_ENV === 'development'){
  baseURL = 'http://api.cangdu.org';
}else{
  baseURL = 'http://api.cangdu.org';
}


export default {imgUrl, baseURL}
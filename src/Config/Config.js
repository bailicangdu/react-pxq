/**
 * 全局配置文件
 */
let baseURL; 
let imgUrl = '//cangdu.org:8001/img/';
if(process.env.NODE_ENV === 'development'){
  baseURL = '//cangdu.org';
}else{
  baseURL = '//cangdu.org';
}


export default {imgUrl, baseURL}
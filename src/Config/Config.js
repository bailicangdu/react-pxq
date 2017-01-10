import FastClick from './fastclick.js';
((doc, win) => {
  const docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = () => {
      let clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  //当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
})(document, window);


if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}


const system = (() => {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  let system;
  if (isAndroid) {
    system = 'Android'
  } else if (isIOS) {
    system = 'IOS'
  }
  return system
})()
const target = process.env.NODE_ENV !== 'production' ? '' : 'http://dev.fe.ptdev.cn'; //目标网站
export {
  target,
  system
}
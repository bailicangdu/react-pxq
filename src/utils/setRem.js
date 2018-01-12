(function(psdw){
  var dpr=0 , rem=0 , scale=0;
  var htmlDOM=document.documentElement;
  dpr=window.devicePixelRatio;
  var currentWidth=htmlDOM.clientWidth;
  scale=currentWidth/psdw;
  rem=psdw/10;
  rem=rem*scale;
  htmlDOM.style.fontSize=rem+'px';
  htmlDOM.setAttribute('data-dpr',dpr)
})(750)
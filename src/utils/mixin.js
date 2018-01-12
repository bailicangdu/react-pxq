export default methods => {
  return target => {
    Object.assign(target.prototype, methods);
  }
}

/**
 * 字符串填充函数
 * @param  {string} value      目标字符串
 * @param  {array} position 需要填充的位置
 * @param  {string} padstr   填充字符串
 * @return {string}          返回目标字符串
 */
export const padStr = (value, position, padstr, inputElement) => {
  position.forEach((item, index) => {
    if (value.length > item + index) {
      value = value.substring(0, item + index) + padstr + value.substring(item + index)
    }
  })
  value = value.trim();
  // 解决安卓部分浏览器插入空格后光标错位问题
  requestAnimationFrame(() => {
    inputElement.setSelectionRange(value.length, value.length); 
  })
  return value;
}


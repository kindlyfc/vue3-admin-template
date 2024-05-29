/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
export const regCheck = (reg) => (_rule, value) => {
  if (value && !reg.test(value)) {
    return Promise.reject(new Error());
  } else {
    return Promise.resolve();
  }
};

// 小数或整数(不可以负数)(保留 2 位小数)
export function verifyNumberIntegerAndFloat(val) {
  // 匹配空格
  let v = val.replace(/(^\s*)|(\s*$)/g, '')
  // 只能是数字和小数点，不能是其他输入
  v = v.replace(/[^\d.]/g, '')
  // 以0开始只能输入一个
  v = v.replace(/^0{2}$/g, '0')
  // 保证第一位只能是数字，不能是点
  v = v.replace(/^\./g, '')
  // 小数只能出现 1 位
  v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  // 小数点后面保留 2 位
  v = v.replace(/^(\\-)_(\d+)\.(\d\d)._$/, '$1$2.$3')
  // 返回结果

  return v
}
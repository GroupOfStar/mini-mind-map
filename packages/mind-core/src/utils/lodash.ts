/**
 * 防抖
 * @param fn 被防抖的函数
 * @param time 防抖间隔
 * @returns 被包装防抖后的函数
 */
export function debounce(fn: Function, time: number = 300) {
  let timer: NodeJS.Timeout | null = null;
  return function (this: object, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, time);
  };
}

/**
 * 判断是否为数字
 * @param val 值
 * @returns 是否未数字
 */
export function isNumber(val: any): boolean {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

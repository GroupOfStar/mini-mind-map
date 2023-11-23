/** 防抖 */
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

/**
 * 鼠标点击后根据弹出层的高度，显示在1/3处
 * @param dom 弹出层Element
 * @param event 鼠标MouseEvent
 * @returns { x: number, y: number } 返回弹出层的位置
 */
export const showModalByPosition = (
  dom: HTMLElement,
  event: MouseEvent
): { x: number; y: number } => {
  const { innerWidth, innerHeight } = window;
  const { clientX, clientY } = event;
  const { width, height } = dom.getBoundingClientRect();
  let x;
  let y;
  if (clientX + width > innerWidth) {
    x = clientX - width;
  } else {
    x = clientX;
  }
  const oneThirdDivision = clientY - height / 3;
  if (oneThirdDivision < 0) {
    y = 0;
  } else if (oneThirdDivision >= 0 && oneThirdDivision <= innerHeight - height) {
    y = oneThirdDivision;
  } else {
    y = innerHeight - height;
  }
  return { x, y };
};

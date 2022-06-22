/**
 * Checks if clientX and clientY coords are inside given rectangle.
 * Useful to check if MouseEvent is inside given rectangle.
 * @param clientX
 * @param clientY
 * @param left
 * @param right
 * @param top
 * @param bottom
 * @returns true if coords are inside rectangle
 */
const areCoordinatesInRectangle = (
  clientX: number,
  clientY: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
): boolean => {
  return clientX > left && clientX < right && clientY > top && clientY < bottom;
};

interface RectanglePosition {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Get absolute position relative to page (not client screen).
 * @param element HTMLElement
 * @returns RectanglePosition
 */
const getPageRectanglePosition = (element: HTMLElement): RectanglePosition => {
  if (!element || !window) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }
  const clientRect = element.getBoundingClientRect();

  const top = clientRect.top + window.scrollY;
  const left = clientRect.left + window.screenX;
  const right = clientRect.right + window.screenX;
  const bottom = clientRect.bottom + window.screenY;

  return {
    top,
    right,
    bottom,
    left,
  };
};

export { areCoordinatesInRectangle, getPageRectanglePosition };

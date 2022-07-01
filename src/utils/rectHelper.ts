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
      left: 0,
      right: 0,
      bottom: 0,
    };
  }
  const clientRect = element.getBoundingClientRect();
  return {
    top: clientRect.top,
    left: clientRect.left,
    right: clientRect.right,
    bottom: clientRect.bottom,
  };
};

export { areCoordinatesInRectangle, getPageRectanglePosition };

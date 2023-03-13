export interface Tool {
  type: 'rect' | 'brush' | 'eraser' | 'circle';
  strokeColor: string;
  fillColor: string;
  widthLine: number;
  x?: number;
  y?: number;
  rx?: number;
  ry?: number;
  width?: number;
  height?: number;
}

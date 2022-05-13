export type Coordinate = [number, number];
export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};
export type Tile = Rect & {
  tileKey: string;
};

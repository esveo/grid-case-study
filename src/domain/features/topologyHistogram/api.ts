import { scaleLinear } from "d3-scale";
import { Coordinate } from "../../../lib/geometry";
import { random } from "../../../lib/random";
import { sleep } from "../../../lib/sleep";
import { TopologyHistogramTile } from "./types";

export async function loadTopologyHistogramTile(
  tileKey: string
): Promise<TopologyHistogramTile> {
  const delay = random(400, 900);
  await sleep(delay);

  const [x, y] = JSON.parse(tileKey) as Coordinate;

  const index = y * 10000 + x;

  const colorOffset = index % 15;

  return {
    color: scaleLinear([0, 15], ["blue", "red"])(colorOffset),
    numberOfSections: index % 15,
    tileKey,
  };
}

import {
  SpeedPartitionFeatureName,
  SpeedPartitionTile,
} from "./speedPartition/types";
import {
  TopologyHistogramFeatureName,
  TopologyHistogramTile,
} from "./topologyHistogram/types";

export type FeatureName =
  | SpeedPartitionFeatureName
  | TopologyHistogramFeatureName;

export type TileDataByFeatureName = {
  speedPartition: SpeedPartitionTile;
  topologyHistogram: TopologyHistogramTile;
};

import { each } from "async-parallel";
import { useEffect, useRef, useState } from "react";
import { loadSpeedPartitionTile } from "./domain/features/speedPartition/api";
import { loadTopologyHistogramTile } from "./domain/features/topologyHistogram/api";
import { TileDataByFeatureName } from "./domain/features/types";
import { Rect, Tile } from "./lib/geometry";

export function MonolithicTileGrid<
  TFeature extends keyof TileDataByFeatureName
>(props: { featureName: TFeature }) {
  const [viewport, setViewport] = useState<Rect>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [tiles, setTiles] = useState<Tile[]>([]);
  type TileState<TData> = {
    state: "loading" | "success";
    data: TData | null;
  };
  const [speedPartitionTileDataCache, setSpeedPartitionTileDataCache] =
    useState<{
      [key: string]: TileState<TileDataByFeatureName["speedPartition"]>;
    }>({});
  const [topologyHistogramTileDataCache, setTopologyHistogramTileDataCache] =
    useState<{
      [key: string]: TileState<TileDataByFeatureName["topologyHistogram"]>;
    }>({});
  const relevantCache =
    props.featureName === "speedPartition"
      ? speedPartitionTileDataCache
      : topologyHistogramTileDataCache;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const tiles: Tile[] = [];
      const tileSize = 200;
      for (
        let y = Math.floor(viewport.top / tileSize) * tileSize;
        y < Math.ceil((viewport.top + viewport.height) / tileSize) * tileSize;
        y += tileSize
      ) {
        for (
          let x = Math.floor(viewport.left / tileSize) * tileSize;
          x < Math.ceil((viewport.left + viewport.width) / tileSize) * tileSize;
          x += tileSize
        ) {
          tiles.push({
            top: y,
            left: x,
            width: tileSize,
            height: tileSize,
            tileKey: JSON.stringify([x, y]),
          });
        }
      }
      setTiles(tiles);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [viewport]);

  useEffect(() => {
    const newTiles = tiles.filter((tile) => !(tile.tileKey in relevantCache));
    if (props.featureName === "speedPartition") {
      setSpeedPartitionTileDataCache((old) => {
        const newCache = { ...old };
        for (const tile of newTiles) {
          newCache[tile.tileKey] = { state: "loading", data: null };
        }
        return newCache;
      });
    } else {
      setTopologyHistogramTileDataCache((old) => {
        const newCache = { ...old };
        for (const tile of newTiles) {
          newCache[tile.tileKey] = { state: "loading", data: null };
        }
        return newCache;
      });
    }

    each(
      newTiles,
      async (tile) => {
        if (props.featureName === "speedPartition") {
          const tileData = await loadSpeedPartitionTile(tile.tileKey);
          setSpeedPartitionTileDataCache((old) => ({
            ...old,
            [tile.tileKey]: { state: "success", data: tileData },
          }));
        }
        if (props.featureName === "topologyHistogram") {
          const tileData = await loadTopologyHistogramTile(tile.tileKey);
          setTopologyHistogramTileDataCache((old) => ({
            ...old,
            [tile.tileKey]: { state: "success", data: tileData },
          }));
        }
      },
      5
    );
  }, [tiles, props.featureName]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewport((oldViewport) => ({
          ...oldViewport,
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height),
        }));
      }
    });
    resizeObserver.observe(containerRef.current!);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="tile-grid"
      onScroll={(e) => {
        const { scrollTop, scrollLeft } = e.currentTarget;
        setViewport((old) => ({
          ...old,
          top: Math.floor(scrollTop),
          left: Math.floor(scrollLeft),
        }));
      }}
    >
      <div className="scroll-content">
        {tiles.map((tile) => {
          const state = relevantCache[tile.tileKey];
          return (
            <div
              className="tile"
              style={{ ...tile, background: state?.data?.color }}
              key={tile.tileKey}
            >
              {!state?.data && "⏳"}
              {state?.data && "label" in state.data && (
                <span>{state.data.label}</span>
              )}

              {state?.data && "numberOfSections" in state.data && (
                <span>{state.data.numberOfSections} Histograms</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="view-port-display">
        y: {viewport.top}, x: {viewport.left}, w: {viewport.width}, h:{" "}
        {viewport.height}
      </div>
    </div>
  );
}

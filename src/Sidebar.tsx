import { FeatureName } from "./domain/features/types";

export function Sidebar(props: {
  selectedFeature: FeatureName;
  setSelectedFeature: (feature: FeatureName) => void;
}) {
  return (
    <nav className="nav">
      <h2>Select Feature</h2>
      <ul>
        <li>
          <button
            onClick={() => props.setSelectedFeature("speedPartition")}
            data-selected={props.selectedFeature === "speedPartition"}
          >
            Speed Partitions
          </button>
        </li>
        <li>
          <button
            onClick={() => props.setSelectedFeature("topologyHistogram")}
            data-selected={props.selectedFeature === "topologyHistogram"}
          >
            Topology Histograms
          </button>
        </li>
      </ul>
    </nav>
  );
}

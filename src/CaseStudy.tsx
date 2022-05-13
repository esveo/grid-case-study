import { useState } from "react";
import "./CaseStudy.scss";
import { FeatureName } from "./domain/features/types";
import { MonolithicTileGrid } from "./MonolithicTileGrid";
import { Sidebar } from "./Sidebar";

export function CaseStudy() {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureName>("speedPartition");
  return (
    <div className="case-study-container">
      <Sidebar
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
      />
      <MonolithicTileGrid featureName={selectedFeature} />
    </div>
  );
}

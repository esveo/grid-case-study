import { useEffect, useState } from "react";
import { makeVar } from "./reactiveVar";

export type CssMode = "dark" | "light";

export const cssMode = makeVar<CssMode>("dark");

function solveExercise6() {
  function App() {
    const [currentCssMode, setCurrentCssMode] = useState(cssMode.getValue());

    useEffect(() => {
      return cssMode.subscribe(() => setCurrentCssMode(cssMode.getValue()));
    }, []);

    return <h1>{currentCssMode}</h1>;
  }

  setInterval(() => {
    if (cssMode.getValue() === "dark") cssMode.setValue("light");
    else cssMode.setValue("dark");
  }, 2000);

  return { App };
}

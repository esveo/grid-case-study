import { useEffect, useState } from "react";
import { cssMode } from "./cssMode";

export type ReactiveVariable<T> = {
  getValue: () => T;
  setValue: (newValue: T) => void;
  subscribe: (onChange: () => void) => () => void;
};

export function makeVar<T>(initialValue: T): ReactiveVariable<T> {
  let listeners: (() => void)[] = [];
  let currentValue = initialValue;

  function getValue() {
    return currentValue;
  }

  function setValue(newValue: T) {
    currentValue = newValue;
    for (const listener of listeners) listener();
  }

  function subscribe(onChange: () => void) {
    listeners.push(onChange);

    function unsubscribe() {
      listeners = listeners.filter((l) => l !== onChange);
    }

    return unsubscribe;
  }

  return {
    getValue,
    setValue,
    subscribe,
  };
}

export function useReactiveVar<TValue>(variable: ReactiveVariable<TValue>) {
  const [currentValue, setCurrentValue] = useState(variable.getValue());
  useEffect(() => {
    setCurrentValue(variable.getValue());
    return variable.subscribe(() => {
      setCurrentValue(variable.getValue());
    });
  }, [variable]);

  return currentValue;
}

function solveExercise7() {
  function App() {
    const currentCssMode = useReactiveVar(cssMode);

    return <h1>{currentCssMode}</h1>;
  }

  setInterval(() => {
    if (cssMode.getValue() === "dark") cssMode.setValue("light");
    else cssMode.setValue("dark");
  }, 2000);

  return { App };
}

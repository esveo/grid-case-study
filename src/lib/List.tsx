import { ReactNode } from "react";

export function List<TItem>(props: {
  items: TItem[];
  renderItem: (item: TItem) => ReactNode;
  getItemKey: (item: TItem) => string | number;
}) {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={props.getItemKey(item)}>{props.renderItem(item)}</li>
      ))}
    </ul>
  );
}

/**
 * Example usage:
 */
function App() {
  return (
    <>
      <List
        items={[1, 2, 3]}
        renderItem={(i) => `Number is ${i}`}
        getItemKey={(i) => i}
      />
      <List
        items={["Hans", "Gloria", "Alex"]}
        getItemKey={(i) => i}
        renderItem={(name) => (
          <>
            User <b>{name}</b>
          </>
        )}
      />
    </>
  );
}

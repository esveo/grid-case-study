import { createContext, ReactNode, useContext, useState } from "react";

export type ListContext<TItem> = {
  items: TItem[];
  filter: string;
  setFilter: (newFilter: string) => void;
  filteredItems: TItem[];
  renderItem: (item: TItem) => ReactNode;
  getItemKey: (item: TItem) => string | number;
  getSearchableStringFromItem: (item: TItem) => string;
};

export const ListContext = createContext<ListContext<any> | null>(null);

export function List<TItem>(props: {
  items: TItem[];
  renderItem: (item: TItem) => ReactNode;
  getItemKey: (item: TItem) => string | number;
  getSearchableStringFromItem: (item: TItem) => string;
  children?: ReactNode;
}) {
  const [filter, setFilter] = useState("");

  const lowercaseFilter = filter.toLowerCase();

  const filteredItems = props.items.filter((item) =>
    props
      .getSearchableStringFromItem(item)
      .toLowerCase()
      .includes(lowercaseFilter)
  );

  const contextValue: ListContext<TItem> = {
    items: props.items,
    getItemKey: props.getItemKey,
    getSearchableStringFromItem: props.getSearchableStringFromItem,
    renderItem: props.renderItem,
    filter,
    setFilter,
    filteredItems,
  };

  return (
    <ListContext.Provider value={contextValue}>
      {props.children}
    </ListContext.Provider>
  );
}

export function useListContext<T = unknown>(): ListContext<T> {
  const context = useContext(ListContext);
  if (!context) throw new Error("ListContext not found.");

  return context;
}

export function ListItems() {
  const context = useListContext();

  return (
    <ul>
      {context.filteredItems.map((item) => (
        <li key={context.getItemKey(item)}>{context.renderItem(item)}</li>
      ))}
    </ul>
  );
}
/**
 * Adding the components as fields on the main component
 * allows us to "scope" the sub-components
 * This makes it clear, that they should only be used
 * within a List
 */
List.ListItems = ListItems;

export function ListFilter() {
  const context = useListContext();
  return (
    <input
      placeholder="Search"
      value={context.filter}
      onChange={(e) => context.setFilter(e.target.value)}
    />
  );
}

List.ListFilter = ListFilter;

export function ListFilterCount(props: {
  children: (props: { count: number; filter: string }) => ReactNode;
}) {
  const context = useListContext();
  return (
    <>
      {props.children({
        count: context.filteredItems.length,
        filter: context.filter,
      })}
    </>
  );
}

List.ListFilterCount = ListFilterCount;

function App() {
  const data = [
    { name: "Carol", id: 1 },
    { name: "Franco", id: 2 },
    { name: "Khanh", id: 3 },
  ];

  return (
    <List
      items={data}
      renderItem={(item) => item.name}
      getItemKey={(item) => item.id}
      getSearchableStringFromItem={(item) => item.name}
    >
      <h1>Your friends</h1>
      <List.ListItems />
      <hr />
      <List.ListFilter />
      <List.ListFilterCount>
        {({ count, filter }) => filter && <>{count} friends match the filter</>}
      </List.ListFilterCount>
    </List>
  );
}

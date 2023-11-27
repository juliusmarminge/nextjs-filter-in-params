import { Item } from "~/components/list";

export function ListItem(props: { item: Item }) {
  return (
    <div className="rounded p-2 bg-muted">
      {props.item.title} - by {props.item.author}
    </div>
  );
}

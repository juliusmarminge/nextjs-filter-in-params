import { randomUUID } from "crypto";
import { List } from "~/components/list";

const AUTHORS = ["John Doe", "Emma Wilson", "Bob Thompson", "Alice Johnson"];

const getItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Array.from({ length: 50 }).map((_, index) => ({
    id: randomUUID(),
    title: `Item ${index}`,
    author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
    createdAt: Math.random() * 1000000000000,
  }));
};

export default async function Home() {
  const items = await getItems();

  return (
    <main className="p-16">
      <List items={items} />
    </main>
  );
}

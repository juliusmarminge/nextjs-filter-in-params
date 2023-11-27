"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { ColumnFiltersState } from "@tanstack/react-table";
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DebouncedInput } from "~/ui/input";

import { DataTableFacetedFilter } from "~/components/filter";
import { ListItem } from "~/components/list-item";

export type Item = {
  id: string;
  author: string;
  title: string;
  createdAt: number;
};

const columnHelper = createColumnHelper<Item>();

const columns = [
  columnHelper.accessor("title", {
    filterFn: "includesString",
  }),
  columnHelper.accessor("author", {
    filterFn: (row, id, value) => {
      return (value as any[]).includes(row.getValue(id));
    },
  }),
  columnHelper.accessor("createdAt", {}),
];

export function List(props: { items: Item[] }) {
  const [animationParent] = useAutoAnimate();

  const search = useSearchParams();
  const router = useRouter();

  const columnFilters = useMemo(() => {
    const filters: ColumnFiltersState = [];

    const authors = search.get("author");
    if (authors !== null) {
      filters.push({
        id: "author",
        value: authors.split(","),
      });
    }

    const title = search.get("title");
    if (title !== null) {
      filters.push({
        id: "title",
        value: title,
      });
    }

    return filters;
  }, [search]);

  const table = useReactTable({
    data: props.items,
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const rows = table.getRowModel().rows;

  return (
    <>
      <div className="flex items-center gap-4 px-1 mb-4">
        <DebouncedInput
          placeholder="Search title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(val) => {
            table.getColumn("title")?.setFilterValue(val);
            const url = new URL(window.location.href);
            val
              ? url.searchParams.set("title", val)
              : url.searchParams.delete("title");
            router.push(url.href);
          }}
          className="h-8 w-32 lg:w-64"
        />

        <DataTableFacetedFilter
          title="Author"
          column={table.getColumn("author")!}
          options={[
            ...new Set(
              table
                .getPreFilteredRowModel()
                .rows.map((r) => r.original.author)
                .sort()
            ),
          ].map((author) => ({
            label: author,
            value: author,
          }))}
        />
      </div>

      {rows.length > 0 ? (
        <ul className="flex flex-col gap-1" ref={animationParent}>
          {rows.map((pull) => (
            <ListItem key={pull.id} item={pull.original} />
          ))}
        </ul>
      ) : (
        <p>No items</p>
      )}
    </>
  );
}

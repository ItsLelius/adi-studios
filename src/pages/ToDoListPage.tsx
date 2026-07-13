import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  FileText,
  ListTodo,
  Plus,
  Search,
  User,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { toDoItems } from "../data/mockToDoData";
import type { CurrentUser, ToDoItem, ToDoStatus } from "../types";

type ToDoListPageProps = {
  onOpenSidebar: () => void;
  currentUser: CurrentUser;
};

export function ToDoListPage({
  onOpenSidebar,
  currentUser,
}: ToDoListPageProps) {
  const [selectedToDoId, setSelectedToDoId] = useState(toDoItems[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const visibleItems = useMemo(() => {
    if (currentUser.role === "admin") {
      return toDoItems;
    }

    return toDoItems.filter((item) => item.assignee === currentUser.name);
  }, [currentUser]);

  const filteredItems = useMemo(() => {
    return visibleItems.filter((item) => {
      const query = search.toLowerCase();

      return (
        item.title.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.assignee.toLowerCase().includes(query)
      );
    });
  }, [search, visibleItems]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedToDoId) ??
    filteredItems[0] ??
    null;

  const assignedCount = visibleItems.filter(
    (item) => item.status === "assigned",
  ).length;

  const inProgressCount = visibleItems.filter(
    (item) => item.status === "in_progress",
  ).length;

  const doneCount = visibleItems.filter((item) => item.status === "done").length;

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={isAdmin ? "To Do List" : "My To Do List"}
        description={
          isAdmin
            ? "All assigned content containers with caption, Prompt A, and Prompt B."
            : "Your assigned content containers with caption, Prompt A, and Prompt B."
        }
        onOpenSidebar={onOpenSidebar}
        accent="blue"
        pills={[
          {
            icon: ListTodo,
            value: visibleItems.length,
            label: "Total items",
            accent: "blue",
          },
          {
            icon: FileText,
            value: assignedCount,
            label: "Assigned",
            accent: "violet",
          },
          {
            icon: User,
            value: inProgressCount,
            label: "In progress",
            accent: "amber",
          },
          {
            icon: CheckCircle2,
            value: doneCount,
            label: "Done",
            accent: "emerald",
          },
        ]}
      />

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[#111318] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Assigned Items
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {isAdmin
                  ? "All worker instruction containers."
                  : "Only items assigned to you."}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => alert("Later: create new To Do item")}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-400"
                title="New To Do"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0D10] px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search to-do items..."
              className="w-full min-w-0 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="scroll-panel min-h-0 flex-1 overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <EmptyToDoList />
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <ToDoCard
                    key={item.id}
                    item={item}
                    selected={selectedItem?.id === item.id}
                    onClick={() => setSelectedToDoId(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111318]">
          {selectedItem ? (
            <ToDoViewer item={selectedItem} isAdmin={isAdmin} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-center">
              <div>
                <ListTodo className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 font-semibold text-white">
                  Select a To Do item
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Caption, Prompt A, and Prompt B will appear here.
                </p>
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}

function ToDoCard({
  item,
  selected,
  onClick,
}: {
  item: ToDoItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-blue-500/45 bg-blue-500/[0.065] ring-1 ring-blue-500/30"
          : "border-white/10 bg-[#0B0D10] hover:border-white/20 hover:bg-[#14171d]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b",
          brandGradient(item.brand),
        ].join(" ")}
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={item.status} />

        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold text-slate-300">
          {item.brand}
        </span>
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-white">
        {item.title}
      </h3>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <User className="h-3.5 w-3.5" />
        {item.assignee}
      </p>
    </button>
  );
}

function ToDoViewer({
  item,
  isAdmin,
}: {
  item: ToDoItem;
  isAdmin: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/10 bg-[#111318] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-slate-300">
                {item.brand}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-slate-300">
                {item.createdAt}
              </span>
            </div>

            <h2 className="mt-3 break-words text-3xl font-black leading-tight text-white">
              {item.title}
            </h2>

            <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <User className="h-4 w-4 text-slate-500" />
              Assigned to {item.assignee}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {isAdmin && (
              <button
                onClick={() => alert("Later: edit To Do item")}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => alert("Later: update item status")}
              className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-400"
            >
              {isAdmin ? "Mark Done" : "Done"}
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-panel min-h-0 flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl space-y-5">
          <CopyBlock label="Caption" value={item.caption} tone="blue" />
          <CopyBlock label="Prompt A" value={item.promptA} tone="violet" />
          <CopyBlock label="Prompt B" value={item.promptB} tone="emerald" />

          {item.notes && (
            <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.055] p-5">
              <p className="text-xs font-black uppercase tracking-wide text-amber-300">
                Notes
              </p>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                {item.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "violet" | "emerald";
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D10]">
      <div
        className={[
          "flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4",
          toneHeader(tone),
        ].join(" ")}
      >
        <p className="text-xs font-black uppercase tracking-wide text-white">
          {label}
        </p>

        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/[0.1]"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>
      </div>

      <div className="p-5">
        <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-200">
          {value}
        </p>
      </div>
    </section>
  );
}

function EmptyToDoList() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0B0D10] p-8 text-center">
      <div>
        <ListTodo className="mx-auto h-10 w-10 text-slate-600" />
        <p className="mt-3 font-semibold text-white">No To Do items found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try a different search or create a new assigned item.
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ToDoStatus }) {
  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        statusStyle(status),
      ].join(" ")}
    >
      {statusLabel(status)}
    </span>
  );
}

function statusLabel(status: ToDoStatus) {
  switch (status) {
    case "assigned":
      return "Assigned";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function statusStyle(status: ToDoStatus) {
  switch (status) {
    case "assigned":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "in_progress":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "done":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function brandGradient(brand: string) {
  switch (brand) {
    case "Maya's Kitchen":
      return "from-emerald-400 via-emerald-500 to-green-600";
    case "Chef Marrow":
      return "from-amber-400 via-orange-500 to-yellow-600";
    case "Noutrix":
      return "from-cyan-400 via-blue-500 to-violet-600";
    default:
      return "from-blue-400 via-violet-500 to-cyan-500";
  }
}

function toneHeader(tone: "blue" | "violet" | "emerald") {
  switch (tone) {
    case "blue":
      return "bg-blue-500/10";
    case "violet":
      return "bg-violet-500/10";
    case "emerald":
      return "bg-emerald-500/10";
    default:
      return "bg-white/5";
  }
}
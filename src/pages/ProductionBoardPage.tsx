import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  ExternalLink,
  Plus,
  Search,
  User,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { tasks } from "../data/mockData";
import type { CurrentUser, Task, TaskStatus } from "../types";

type ProductionBoardPageProps = {
  onOpenSidebar: () => void;
  currentUser: CurrentUser;
};

const statusOptions: Array<"all" | TaskStatus> = [
  "all",
  "to_generate",
  "in_progress",
  "submitted",
  "needs_revision",
  "approved",
  "ready_to_upload",
  "posted",
];

export function ProductionBoardPage({
  onOpenSidebar,
  currentUser,
}: ProductionBoardPageProps) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");

  const visibleTasks = useMemo(() => {
    if (currentUser.role === "admin") {
      return tasks;
    }

    return tasks.filter((task) => task.assignee === currentUser.name);
  }, [currentUser]);

  const filteredTasks = useMemo(() => {
    return visibleTasks.filter((task) => {
      const query = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.brand.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, visibleTasks]);

  const selectedTask =
    filteredTasks.find((task) => task.id === selectedTaskId) ??
    filteredTasks[0] ??
    null;

  const submittedCount = visibleTasks.filter(
    (task) => task.status === "submitted",
  ).length;

  const revisionCount = visibleTasks.filter(
    (task) => task.status === "needs_revision",
  ).length;

  const readyCount = visibleTasks.filter(
    (task) => task.status === "ready_to_upload",
  ).length;

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title={isAdmin ? "Production Board" : "My Submissions"}
        description={
          isAdmin
            ? "Track production status, submissions, revisions, approvals, and posting progress."
            : "Track your assigned production items and submitted work."
        }
        onOpenSidebar={onOpenSidebar}
        accent="violet"
        pills={[
          {
            icon: ClipboardList,
            value: visibleTasks.length,
            label: isAdmin ? "Production items" : "My items",
            accent: "violet",
          },
          {
            icon: CircleDot,
            value: submittedCount,
            label: "Submitted",
            accent: "amber",
          },
          {
            icon: AlertTriangle,
            value: revisionCount,
            label: "Needs revision",
            accent: "orange",
          },
          {
            icon: CheckCircle2,
            value: readyCount,
            label: "Ready",
            accent: "emerald",
          },
        ]}
      />

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[#111318] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                {isAdmin ? "Production Items" : "My Items"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {isAdmin
                  ? "Status tracker for content workflow."
                  : "Only production items assigned to you."}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => alert("Later: create production item")}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400"
                title="New production item"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mb-3 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0D10] px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search production..."
              className="w-full min-w-0 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | TaskStatus)
            }
            className="mb-4 rounded-xl border border-white/10 bg-[#0B0D10] px-3 py-2.5 text-sm font-semibold text-slate-300 outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status} className="bg-[#111318]">
                {status === "all" ? "All statuses" : taskStatusLabel(status)}
              </option>
            ))}
          </select>

          <div className="scroll-panel min-h-0 flex-1 overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <EmptyProduction />
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <ProductionListCard
                    key={task.id}
                    task={task}
                    selected={selectedTask?.id === task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111318]">
          {selectedTask ? (
            <ProductionDetail task={selectedTask} isAdmin={isAdmin} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-center">
              <div>
                <ClipboardList className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 font-semibold text-white">
                  Select a production item
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Status and production details will appear here.
                </p>
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}

function ProductionListCard({
  task,
  selected,
  onClick,
}: {
  task: Task;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-violet-500/45 bg-violet-500/[0.06] ring-1 ring-violet-500/30"
          : "border-white/10 bg-[#0B0D10] hover:border-white/20 hover:bg-[#14171d]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b",
          statusGradient(task.status),
        ].join(" ")}
      />

      <TaskStatusBadge status={task.status} />

      <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-snug text-white">
        {task.title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-white/5 px-2.5 py-1">
          {task.brand}
        </span>

        <span className="rounded-full bg-white/5 px-2.5 py-1">
          {task.assignee}
        </span>
      </div>
    </button>
  );
}

function ProductionDetail({
  task,
  isAdmin,
}: {
  task: Task;
  isAdmin: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/10 bg-[#111318] p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <TaskStatusBadge status={task.status} />

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-slate-300">
                {task.brand}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-slate-300">
                Due {task.due}
              </span>
            </div>

            <h2 className="mt-3 break-words text-3xl font-black leading-tight text-white">
              {task.title}
            </h2>

            <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <User className="h-4 w-4 text-slate-500" />
              Assigned to {task.assignee}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {isAdmin && (
              <button
                onClick={() => alert("Later: edit production item")}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => alert("Later: open submission link")}
              className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-400"
            >
              <ExternalLink className="h-4 w-4" />
              Submission
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-panel min-h-0 flex-1 overflow-y-auto p-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-white/10 bg-[#0B0D10] p-5">
            <h3 className="text-base font-bold text-white">
              Production Details
            </h3>

            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
              {task.detail}
            </p>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-[#0B0D10] p-5">
            <h3 className="text-base font-bold text-white">Status Overview</h3>
            <p className="mt-1 text-sm text-slate-500">
              {isAdmin
                ? "Admin tracking section for production movement."
                : "Your current production status."}
            </p>

            <div className="mt-4 space-y-3">
              <InfoLine label="Current Status" value={taskStatusLabel(task.status)} />
              <InfoLine label="Assigned To" value={task.assignee} />
              <InfoLine label="Page" value={task.brand} />
              <InfoLine label="Due" value={task.due} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111318] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function EmptyProduction() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0B0D10] p-8 text-center">
      <div>
        <ClipboardList className="mx-auto h-10 w-10 text-slate-600" />
        <p className="mt-3 font-semibold text-white">
          No production items found
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Try a different search or status filter.
        </p>
      </div>
    </div>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        taskStatusStyle(status),
      ].join(" ")}
    >
      {taskStatusLabel(status)}
    </span>
  );
}

function taskStatusLabel(status: TaskStatus) {
  switch (status) {
    case "to_generate":
      return "To Generate";
    case "in_progress":
      return "In Progress";
    case "submitted":
      return "Submitted";
    case "needs_revision":
      return "Needs Revision";
    case "approved":
      return "Approved";
    case "ready_to_upload":
      return "Ready";
    case "posted":
      return "Posted";
    default:
      return status;
  }
}

function taskStatusStyle(status: TaskStatus) {
  switch (status) {
    case "to_generate":
      return "border-white/10 bg-white/5 text-slate-300";
    case "in_progress":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "submitted":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "needs_revision":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "approved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "ready_to_upload":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "posted":
      return "border-green-500/20 bg-green-500/10 text-green-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function statusGradient(status: TaskStatus) {
  switch (status) {
    case "to_generate":
      return "from-slate-400 via-slate-500 to-slate-600";
    case "in_progress":
      return "from-blue-400 via-blue-500 to-cyan-500";
    case "submitted":
      return "from-amber-400 via-orange-500 to-yellow-500";
    case "needs_revision":
      return "from-red-400 via-orange-500 to-amber-500";
    case "approved":
      return "from-emerald-400 via-emerald-500 to-green-600";
    case "ready_to_upload":
      return "from-violet-400 via-violet-500 to-blue-500";
    case "posted":
      return "from-green-400 via-emerald-500 to-teal-500";
    default:
      return "from-slate-400 via-slate-500 to-slate-600";
  }
}
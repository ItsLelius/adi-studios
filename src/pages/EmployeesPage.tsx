import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock,
  Edit3,
  Mail,
  Plus,
  Search,
  Shield,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { employees, tasks } from "../data/mockData";
import type { Employee, Task, TaskStatus } from "../types";

type EmployeesPageProps = {
  onOpenSidebar: () => void;
};

const openTaskStatuses: TaskStatus[] = [
  "to_generate",
  "in_progress",
  "submitted",
  "needs_revision",
  "approved",
  "ready_to_upload",
];

export function EmployeesPage({ onOpenSidebar }: EmployeesPageProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    employees[0]?.id ?? "",
  );
  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const query = search.toLowerCase();

      return (
        employee.name.toLowerCase().includes(query) ||
        employee.role.toLowerCase().includes(query) ||
        employee.status.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ??
    filteredEmployees[0] ??
    employees[0] ??
    null;

  const onlineCount = employees.filter(
    (employee) => employee.status === "Online",
  ).length;

  const openTasksCount = tasks.filter((task) =>
    openTaskStatuses.includes(task.status),
  ).length;

  const submittedCount = tasks.filter(
    (task) => task.status === "submitted",
  ).length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Employees"
        description="Manage employee access, roles, online status, and assigned work summaries."
        onOpenSidebar={onOpenSidebar}
        accent="orange"
        pills={[
          {
            icon: Users,
            value: employees.length,
            label: "Total employees",
            accent: "orange",
          },
          {
            icon: UserCheck,
            value: onlineCount,
            label: "Online now",
            accent: "emerald",
          },
          {
            icon: Activity,
            value: openTasksCount,
            label: "Open tasks",
            accent: "blue",
          },
          {
            icon: CheckCircle2,
            value: submittedCount,
            label: "Submitted",
            accent: "violet",
          },
        ]}
      />

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[#111318] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-300">
                Team
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Admin and employee accounts.
              </p>
            </div>

            <button
              onClick={() => alert("Later: open register employee modal")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-400"
              title="Register employee"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0D10] px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees..."
              className="w-full min-w-0 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="scroll-panel min-h-0 flex-1 overflow-y-auto pr-1">
            {filteredEmployees.length === 0 ? (
              <EmptyEmployees />
            ) : (
              <div className="space-y-3">
                {filteredEmployees.map((employee) => {
                  const selected = selectedEmployee?.id === employee.id;

                  return (
                    <EmployeeListCard
                      key={employee.id}
                      employee={employee}
                      selected={selected}
                      onClick={() => setSelectedEmployeeId(employee.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111318]">
          {selectedEmployee ? (
            <EmployeeDetail employee={selectedEmployee} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-center">
              <div>
                <Users className="mx-auto h-10 w-10 text-slate-600" />
                <p className="mt-3 font-semibold text-white">
                  Select an employee
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Employee profile and work summary will appear here.
                </p>
              </div>
            </div>
          )}
        </main>
      </section>
    </div>
  );
}

function EmployeeListCard({
  employee,
  selected,
  onClick,
}: {
  employee: Employee;
  selected: boolean;
  onClick: () => void;
}) {
  const isOnline = employee.status === "Online";
  const isAdmin = employee.role === "Admin";

  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex min-h-[104px] w-full items-center overflow-hidden rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-orange-500/45 bg-orange-500/[0.07] ring-1 ring-orange-500/35"
          : "border-white/10 bg-[#0B0D10] hover:border-white/20 hover:bg-[#14171d]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b",
          isOnline
            ? "from-emerald-400 via-emerald-500 to-green-600"
            : "from-slate-500 via-slate-600 to-slate-700",
        ].join(" ")}
      />

      <div className="absolute right-4 top-4">
        <StatusBadge status={employee.status} />
      </div>

      <div className="flex min-w-0 items-center gap-4 pr-24">
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg",
            isAdmin
              ? "bg-orange-500 shadow-orange-500/20"
              : "bg-blue-500 shadow-blue-500/20",
          ].join(" ")}
        >
          {getInitials(employee.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black leading-tight text-white">
            {employee.name}
          </h3>

          <p className="mt-1 truncate text-sm font-medium text-slate-500">
            {employee.role}
          </p>
        </div>
      </div>
    </button>
  );
}

function EmployeeDetail({ employee }: { employee: Employee }) {
  const summary = getEmployeeTaskSummary(employee.name);
  const assignedTasks = tasks.filter((task) => task.assignee === employee.name);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 bg-[#111318] p-5">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-lg font-black text-white shadow-lg shadow-blue-500/20">
              {getInitials(employee.name)}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words text-2xl font-black leading-tight text-white">
                  {employee.name}
                </h2>

                <RoleBadge role={employee.role} />
                <StatusBadge status={employee.status} />
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                <div className="flex min-w-0 items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate">{makeEmployeeEmail(employee)}</span>
                </div>

                <div className="flex min-w-0 items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate">Last seen {employee.lastSeen}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={() => alert("Later: edit employee modal")}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>

            <button
              onClick={() => alert("Later: assign task to this employee")}
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-blue-400"
            >
              <UserPlus className="h-4 w-4" />
              Assign Task
            </button>

            <button
              onClick={() => alert("Later: deactivate employee access")}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
            >
              <XCircle className="h-4 w-4" />
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-panel min-h-0 flex-1 overflow-y-auto p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Open Tasks"
            value={summary.open}
            icon={Activity}
            accent="blue"
          />

          <SummaryCard
            label="Submitted"
            value={summary.submitted}
            icon={CheckCircle2}
            accent="violet"
          />

          <SummaryCard
            label="Needs Revision"
            value={summary.needsRevision}
            icon={AlertTriangle}
            accent="amber"
          />

          <SummaryCard
            label="Approved"
            value={summary.approved}
            icon={UserCheck}
            accent="emerald"
          />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-[#0B0D10] p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">
                  Assigned Work
                </h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
                  Current and recent production items assigned to this employee.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black text-slate-300">
                {assignedTasks.length} items
              </span>
            </div>

            {assignedTasks.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#111318] p-8 text-center">
                <div>
                  <CircleDot className="mx-auto h-9 w-9 text-slate-600" />
                  <p className="mt-3 font-semibold text-white">
                    No assigned work yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Assign a production item to this employee to start tracking
                    work.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-2xl border border-white/10 bg-[#0B0D10] p-5">
            <h3 className="text-base font-black text-white">Access Control</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Quick account and permission overview.
            </p>

            <div className="mt-4 space-y-3">
              <AccessItem
                icon={Shield}
                label="Role"
                value={employee.role}
                tone={employee.role === "Admin" ? "orange" : "blue"}
              />

              <AccessItem
                icon={UserCheck}
                label="Account Status"
                value="Active"
                tone="emerald"
              />

              <AccessItem
                icon={Clock}
                label="Presence"
                value={employee.status}
                tone={employee.status === "Online" ? "emerald" : "slate"}
              />
            </div>

            <div className="mt-5 rounded-xl border border-orange-500/15 bg-orange-500/[0.05] p-4">
              <p className="text-sm font-black text-orange-200">MVP Note</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Later, this page will connect to Supabase Auth for real employee
                registration, role updates, and account disabling.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: "blue" | "violet" | "amber" | "emerald";
}) {
  const styles = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B0D10] p-4">
      <div className="flex items-center justify-between gap-3">
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
            styles[accent],
          ].join(" ")}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <p className="text-2xl font-black text-white">{value}</p>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111318] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-black text-white">
            {task.title}
          </h4>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {task.detail}
          </p>
        </div>

        <TaskStatusBadge status={task.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-white/5 px-2.5 py-1">
          {task.brand}
        </span>

        <span className="rounded-full bg-white/5 px-2.5 py-1">
          Due {task.due}
        </span>
      </div>
    </div>
  );
}

function AccessItem({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "orange" | "blue" | "emerald" | "slate";
}) {
  const styles = {
    orange: "text-orange-300 bg-orange-500/10 border-orange-500/20",
    blue: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    slate: "text-slate-300 bg-white/5 border-white/10",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111318] p-3">
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
          styles[tone],
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: Employee["role"] }) {
  const style =
    role === "Admin"
      ? "border-orange-500/20 bg-orange-500/10 text-orange-300"
      : "border-blue-500/20 bg-blue-500/10 text-blue-300";

  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-xs font-black",
        style,
      ].join(" ")}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: Employee["status"] }) {
  const style =
    status === "Online"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : "border-white/10 bg-white/5 text-slate-400";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black",
        style,
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "Online" ? "bg-emerald-400" : "bg-slate-500",
        ].join(" ")}
      />
      {status}
    </span>
  );
}

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={[
        "shrink-0 rounded-full border px-2.5 py-1 text-xs font-black",
        taskStatusStyle(status),
      ].join(" ")}
    >
      {taskStatusLabel(status)}
    </span>
  );
}

function EmptyEmployees() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0B0D10] p-8 text-center">
      <div>
        <Users className="mx-auto h-10 w-10 text-slate-600" />
        <p className="mt-3 font-semibold text-white">No employees found</p>
        <p className="mt-1 text-sm text-slate-500">
          Try a different search or register a new employee.
        </p>
      </div>
    </div>
  );
}

function getEmployeeTaskSummary(employeeName: string) {
  const assigned = tasks.filter((task) => task.assignee === employeeName);

  return {
    total: assigned.length,
    open: assigned.filter((task) => openTaskStatuses.includes(task.status))
      .length,
    submitted: assigned.filter((task) => task.status === "submitted").length,
    needsRevision: assigned.filter((task) => task.status === "needs_revision")
      .length,
    approved: assigned.filter(
      (task) =>
        task.status === "approved" ||
        task.status === "ready_to_upload" ||
        task.status === "posted",
    ).length,
  };
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function makeEmployeeEmail(employee: Employee) {
  return `${employee.name.toLowerCase().replaceAll(" ", ".")}@adistudios.local`;
}
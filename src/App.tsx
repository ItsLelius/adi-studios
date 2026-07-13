import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { adminSidebarItems, employeeSidebarItems } from "./constants/sidebar";
import { mockUsers } from "./data/mockUsers";
import { AssetLibraryPage } from "./pages/AssetLibraryPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ContentIdeasPage } from "./pages/ContentIdeasPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { ProductionBoardPage } from "./pages/ProductionBoardPage";
import { PublishedContentPage } from "./pages/PublishedContentPage";
import { ReadyToUploadPage } from "./pages/ReadyToUploadPage";
import { ToDoListPage } from "./pages/ToDoListPage";
import type { CurrentUser, PageKey } from "./types";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(mockUsers[0]);
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");

  const sidebarItems = useMemo(() => {
    return currentUser.role === "admin" ? adminSidebarItems : employeeSidebarItems;
  }, [currentUser.role]);

  useEffect(() => {
    const currentPageAllowed = sidebarItems.some(
      (item) => item.key === currentPage,
    );

    if (!currentPageAllowed) {
      setCurrentPage(sidebarItems[0]?.key ?? "todo");
    }
  }, [currentPage, sidebarItems]);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function renderPage() {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onOpenSidebar={openSidebar} />;

      case "todo":
        return (
          <ToDoListPage
            onOpenSidebar={openSidebar}
            currentUser={currentUser}
          />
        );

      case "production":
        return (
          <ProductionBoardPage
            onOpenSidebar={openSidebar}
            currentUser={currentUser}
          />
        );

      case "calendar":
        return <CalendarPage onOpenSidebar={openSidebar} />;

      case "ready":
        return <ReadyToUploadPage onOpenSidebar={openSidebar} />;

      case "published":
        return <PublishedContentPage onOpenSidebar={openSidebar} />;

      case "ideas":
        return <ContentIdeasPage onOpenSidebar={openSidebar} />;

      case "assets":
        return <AssetLibraryPage onOpenSidebar={openSidebar} />;

      case "employees":
        return <EmployeesPage onOpenSidebar={openSidebar} />;

      case "profile":
        return (
          <ProfilePage
            currentUser={currentUser}
            onOpenSidebar={openSidebar}
          />
        );

      default:
        return (
          <ComingSoonPage
            title="Coming Soon"
            description="This page will be built after the main studio workflow."
          />
        );
    }
  }

  return (
    <>
      <AppShell
        isSidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        activePage={currentPage}
        onPageChange={setCurrentPage}
        sidebarItems={sidebarItems}
        currentUser={currentUser}
      >
        <div key={currentPage} className="page-transition h-full min-h-0">
          {renderPage()}
        </div>
      </AppShell>

      <DevUserSwitcher
        currentUser={currentUser}
        onChangeUser={(user) => setCurrentUser(user)}
      />
    </>
  );
}

function DevUserSwitcher({
  currentUser,
  onChangeUser,
}: {
  currentUser: CurrentUser;
  onChangeUser: (user: CurrentUser) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[80] rounded-2xl border border-white/10 bg-[#111318]/95 p-3 shadow-2xl backdrop-blur">
      <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-slate-500">
        Preview As
      </p>

      <select
        value={currentUser.id}
        onChange={(event) => {
          const selectedUser =
            mockUsers.find((user) => user.id === event.target.value) ??
            mockUsers[0];

          onChangeUser(selectedUser);
        }}
        className="w-[190px] rounded-xl border border-white/10 bg-[#0B0D10] px-3 py-2 text-sm font-bold text-slate-200 outline-none"
      >
        {mockUsers.map((user) => (
          <option key={user.id} value={user.id} className="bg-[#111318]">
            {user.name} — {user.role}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProfilePage({
  currentUser,
  onOpenSidebar,
}: {
  currentUser: CurrentUser;
  onOpenSidebar: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#111318] p-6">
        <button
          onClick={onOpenSidebar}
          className="mb-4 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white lg:hidden"
        >
          Open Menu
        </button>

        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          My Profile
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          {currentUser.name}
        </h1>

        <p className="mt-2 text-sm text-slate-400">{currentUser.email}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#111318] p-6">
          <p className="text-sm font-black uppercase tracking-wide text-slate-500">
            Role
          </p>

          <p className="mt-3 text-2xl font-black capitalize text-white">
            {currentUser.role}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            This is a preview profile. Later, this connects to Supabase Auth and
            real account settings.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111318] p-6">
          <p className="text-sm font-black uppercase tracking-wide text-slate-500">
            Permissions
          </p>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {currentUser.role === "admin"
              ? "Admin can access all pages, manage employees, create work, assign content, review submissions, and manage publishing."
              : "Employee can only access assigned work, personal submissions, shared assets, and their profile."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div className="max-w-md rounded-2xl border border-white/10 bg-[#111318] p-8 text-center">
        <p className="text-2xl font-black text-white">{title}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default App;
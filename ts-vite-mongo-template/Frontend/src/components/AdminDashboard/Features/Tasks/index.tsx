import { TasksDialogs } from "./components/tasks-dialogs";
import { TasksPrimaryButtons } from "./components/tasks-primary-buttons";
import { Header } from "../../AdminDashboard_Layout/Header";
import { Search } from "../../AdminDashboardComponents/Search";
import { ModeToggle } from "../../AdminDashboardComponents/ModeToggle";
import { ProfileDropdown } from "../../AdminDashboardComponents/ProfileDropdown";
import { initializeTasks } from "@/SampleData/AdminDashboard/Tasks/tasks";
import { Task } from "@/SampleData/AdminDashboard/Tasks/schema";
import TasksProvider from "@/Context/TasksContext";
import { Main } from "../../AdminDashboard_Layout/Main";
import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import { TasksTable } from "./components/task-table";

export default function Tasks() {
  const [_, setTaskList] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await initializeTasks();
        setTaskList(fetchedTasks.tasks);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <TasksTable columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  );
}

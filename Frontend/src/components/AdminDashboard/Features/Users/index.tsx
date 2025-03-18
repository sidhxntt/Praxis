import { columns } from "./components/users-columns";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersTable } from "./components/users-table";
import { Header } from "../../AdminDashboard_Layout/Header";
import { Search } from "../../AdminDashboardComponents/Search";
import { ModeToggle } from "../../AdminDashboardComponents/ModeToggle";
import { ProfileDropdown } from "../../AdminDashboardComponents/ProfileDropdown";
import { initializeUsers } from "@/SampleData/Users/users";
import { User } from "@/SampleData/Users/schema";
import UsersProvider from "@/Context/UsersContext";
import { Main } from "../../AdminDashboard_Layout/Main";
import { useState, useEffect } from "react";

export default function Users() {
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const fetchedUsers = await initializeUsers();
        // console.log('Fetched Users:', fetchedUsers) // Debug log
        setUserList(fetchedUsers);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading users...
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
    <UsersProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}

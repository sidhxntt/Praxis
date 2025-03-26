import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "@/Hooks/use-toast";
import { User } from "@/SampleData/AdminDashboard/Users/schema";
import { Task } from "@/SampleData/AdminDashboard/Tasks/schema";

export const handleUserDelete = async (
  value: string, 
  currentRow: User, 
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>, 
  onOpenChange: (open: boolean) => void
) => {
  if (value.trim() !== currentRow.username) return;
  
  try {
    setIsDeleting(true);
    
    // Get authentication token
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    // Send DELETE request to server
    const response = await axios({
      method: "DELETE",
      url: `${import.meta.env.VITE_USERS_API_ROUTE}/${currentRow.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 200 || response.status === 204) {
      // Close the dialog
      onOpenChange(false);
      
      // Show success toast
      toast({
        title: "User deleted successfully",
        description: `User ${currentRow.username} has been permanently deleted.`,
      });
      
      // Trigger re-render of parent component
      window.dispatchEvent(new CustomEvent('userDataChanged', { 
        detail: { 
          action: 'delete',
          userData: currentRow 
        }
      }));
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Delete API Error:", error);
    toast({
      title: "Error deleting user",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive",
    });
  } finally {
    setIsDeleting(false);
  }
};

export const handleDeleteTask = async (currentRow: Task, setOpen: any, setCurrentRow: any) => {
  if (!currentRow) return;

  const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

  try {
    // Make an Axios DELETE request to the backend API
     await axios({
      method: "DELETE",
      url: `${import.meta.env.VITE_TASKS_API_ROUTE}/${currentRow.id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    // Show success toast
    toast({
      title: "Task deleted successfully",
      description: `Task ${currentRow.id} has been permanently deleted.`,
    });
    

    // Close the dialog and reset the current row
    setOpen(null);
    setCurrentRow(null);
  } catch (error:any) {
    // Handle errors
    toast({
      title: "Error deleting task",
      description: error.response?.data?.message || "An error occurred",
      variant: "destructive",
    });
  }
};

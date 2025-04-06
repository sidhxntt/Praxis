import { UserForm, EditUserForm } from "@/SampleData/AdminDashboard/Users/schema";
import { toast } from "@/temp/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { TasksForm } from "@/SampleData/AdminDashboard/Tasks/schema"
export const onUserSubmit = async (
  data: UserForm | EditUserForm,
  userId: string | undefined,
  form: any,
  onOpenChange: (open: boolean) => void
) => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const isEditing = !!userId;
    let url, method;

    if (isEditing && userId) {
      url = `${import.meta.env.VITE_USERS_API_ROUTE}/${userId}`;
      method = "PATCH";
    } else {
      url = import.meta.env.VITE_SIGNUP_ROUTE;
      method = "POST";
    }

    const response = await axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast({
        title: isEditing
          ? "User updated successfully!"
          : "User created successfully!",
        description: `User ${data.username} has been ${
          isEditing ? "updated" : "created"
        }.`,
      });
      form.reset();
      onOpenChange(false);

      // Return the updated or newly created user
      return response.data;
    }
  } catch (error: any) {
    console.error("API Error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
};

export const onTaskSubmit = async (
  data: TasksForm,
  taskId: string | undefined,
  form: any,
  onOpenChange: (open: boolean) => void
) => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    // Determine if we're editing based on whether userId exists
    const isEditing = !!taskId;

    // Construct the URL and method
    let url, method;

    if (isEditing && taskId) {
      url = `${import.meta.env.VITE_TASKS_API_ROUTE}/${taskId}`;
      method = "PATCH";
    } else {
      url = import.meta.env.VITE_TASKS_API_ROUTE;
      method = "POST";
    }

    console.log(`Making ${method} request to ${url}`);
    console.log("Task ID:", taskId);
    console.log("Is Editing:", isEditing);
    console.log({ Formdata: data });

    const response = await axios({
      method,
      url,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast({
        title: isEditing
          ? "Task updated successfully!"
          : "Task created successfully!",
        description: `Task "${data.title}" has been ${
          isEditing ? "updated" : "created"
        }.`,
      });
      form.reset();
      onOpenChange(false);
    }
  } catch (error: any) {
    console.error("API Error:", error);

    // Better error handling with axios error responses
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  }
};

export const onUserInviteSubmit = async (
  data: any,
  form: any,
  onOpenChange: (open: boolean) => void
) => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    await axios.post(`${import.meta.env.VITE_USERS_API_ROUTE}/invite`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    form.reset();
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Invite sent successfully",
    });
  } catch (error) {
    console.error("Error sending invitation:", error);

    toast({
      title: "Error",
      description: axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to send invitation"
        : "An unexpected error occurred",
      variant: "destructive",
    });
  }
};

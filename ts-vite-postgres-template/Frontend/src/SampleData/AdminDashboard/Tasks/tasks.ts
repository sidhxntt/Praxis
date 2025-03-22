import axios from 'axios';
import { taskListSchema, TaskPaginationResponse } from './schema';
import Cookies from "js-cookie";

// Fetch tasks with pagination
export const fetchTasks = async (page: number = 1, limit: number = 10): Promise<TaskPaginationResponse> => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    const response = await axios.get(import.meta.env.VITE_TASKS_API_ROUTE, {
      params: {
        page,
        limit
      },
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`, 
      }
    });

    if (response.data.status === 'success') {
      const rawTasks = response.data.data.data.map((task: any) => ({
        id: String(task.id),
        title: task.title,
        status: task.status,
        label: task.label,
        priority: task.priority,
        createdAt: new Date(task.created_at || Date.now()),
        updatedAt: new Date(task.updated_at || Date.now()),
      }));

      // Use safeParse to handle validation errors
      const validationResult = taskListSchema.safeParse(rawTasks);
      
      if (!validationResult.success) {
        console.error('Task data validation failed:', validationResult.error);
        return {
          tasks: [],
          total: 0,
          page,
          limit
        };
      }

      return {
        tasks: validationResult.data,
        total: response.data.data.meta.total || 0,
        page: response.data.data.meta.page || page,
        limit: response.data.data.meta.limit || limit
      };
    }
    
    console.warn('No successful response from tasks API');
    return {
      tasks: [],
      total: 0,
      page,
      limit
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      tasks: [],
      total: 0,
      page,
      limit
    };
  }
};

// Initialize tasks with optional pagination
export const initializeTasks = async (page?: number, limit?: number) => {
  return await fetchTasks(page, limit);
};
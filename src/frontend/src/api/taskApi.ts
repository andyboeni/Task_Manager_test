import axios from 'axios';
import { Task, TaskFormData } from '../types/task';

const TASK_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/tasks';

interface PaginatedResponse {
    tasks: Task[];
    totalItems: number;
}

const taskApi = {
    // Connectivity check
    checkConnection: async () => {
        try {
            await axios.get(`${TASK_API_URL}/paginated?pageSize=1`);
            return { connected: true };
        } catch (error) {
            return { connected: false, error };
        }
    },

    getAllTasks: () => axios.get<Task[]>(TASK_API_URL),
    
    getAllTasksWithPagination: (page: number, pageSize: number, searchTerm?: string, sortBy?: string, orderBy?: 'asc' | 'desc') =>
        axios.get<PaginatedResponse>(`${TASK_API_URL}/paginated`, {
            params: {
                pageNumber: page,
                pageSize: pageSize,
                searchTerm: searchTerm?.toLowerCase(),
                sortBy: sortBy,
                orderBy: orderBy?.toLowerCase()
            }
        }),
    
    createTask: (data: TaskFormData) => axios.post<Task>(TASK_API_URL, data),
    updateTask: (id: number, data: TaskFormData) => 
        axios.put<Task>(`${TASK_API_URL}/${id}`, data),
    deleteTask: (id: number) => axios.delete(`${TASK_API_URL}/${id}`),
};

export default taskApi;

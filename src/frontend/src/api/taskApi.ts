import axios from 'axios';
import { Task, TaskFormData, TaskStatus, TaskPriority } from '../types/task';

const TASK_API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/tasks';

interface PaginatedResponse {
    tasks: Task[];
    totalItems: number;
}

const taskApi = {
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

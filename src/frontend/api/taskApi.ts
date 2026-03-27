import axios from 'axios';

const TASK_API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/tasks';

const taskApi = {
    getAllTasks: () => axios.get<Task[]>(TASK_API_URL),
    createTask: (data: TaskFormData) => axios.post<Task>(TASK_API_URL, data),
    updateTask: (id: number, data: TaskFormData) => 
        axios.put<Task>(`${TASK_API_URL}/${id}`, data),
    deleteTask: (id: number) => axios.delete(`${TASK_API_URL}/${id}`),
};

export default taskApi;

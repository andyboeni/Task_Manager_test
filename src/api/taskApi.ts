import axios from 'axios';
import { Task, TaskFormData } from '../types/task';

export const getAllTasks = () => axios.get<Task[]>('/api/tasks');
export const createTask = (data: TaskFormData) => axios.post<Task>('/api/tasks', data);
export const updateTask = (id: number, data: TaskFormData) => axios.put<Task>(`/api/tasks/${id}`, data);
export const deleteTask = (id: number) => axios.delete(`/api/tasks/${id}`);

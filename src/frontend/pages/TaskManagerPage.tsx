import { useState, useEffect } from 'react';
import { AddTask } from '../components/AddTask';
import { TaskList } from '../components/TaskList';
import { UpdateTask } from '../components/UpdateTask';
import taskApi from '../api/taskApi';
import { Task, TaskFormData } from '../types/task';

export const TaskManagerPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const loadTasks = async () => {
        try {
            const response = await taskApi.getAllTasks();
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleCreateTask = async (data: TaskFormData) => {
        try {
            await taskApi.createTask(data);
            await loadTasks();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleUpdateTask = async (id: number, data: TaskFormData) => {
        try {
            await taskApi.updateTask(id, data);
            await loadTasks();
            setSelectedTask(null);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Task Manager</h1>
                
                <AddTask onSubmit={handleCreateTask} />
                
                {selectedTask ? (
                    <div className="mt-8 p-6 border rounded-lg bg-gray-50">
                        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                        <UpdateTask 
                            task={selectedTask}
                            onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
                        />
                        <button
                            type="button"
                            onClick={() => setSelectedTask(null)}
                            className="mt-4 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                ) : null}

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                    <TaskList 
                        tasks={tasks}
                        onTaskSelected={(task) => setSelectedTask(task)}
                    />
                </div>
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { AddTask } from '../components/AddTask';
import { TaskList } from '../components/TaskList';
import { UpdateTask } from '../components/UpdateTask';
import taskApi from '../api/taskApi';
import { Task, TaskFormData } from '../types/task';

export const TaskManagerPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState<string>('id');
    const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalItems, setTotalItems] = useState(0);

    const loadTasks = async () => {
        try {
            const response = await taskApi.getAllTasksWithPagination(
                currentPage,
                itemsPerPage,
                searchTerm,
                sortBy,
                orderBy === 'asc' ? 'ASC' : 'DESC'
            );
            
            setTasks(response.data.tasks);
            setTotalItems(response.data.totalItems || 0);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [currentPage, itemsPerPage, sortBy, orderBy, searchTerm]);

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
            <div className="max-w-6xl mx-auto">
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
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="px-3 py-2 border rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        setCurrentPage(0);
                                        loadTasks();
                                    }
                                }}
                            />
                            
                            <div className="flex space-x-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    <option value="id">ID</option>
                                    <option value="title">Title</option>
                                    <option value="status">Status</option>
                                    <option value="priority">Priority</option>
                                </select>

                                <select
                                    value={orderBy}
                                    onChange={(e) => setOrderBy(e.target.value as 'asc' | 'desc')}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span>Items per page:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(0);
                                        loadTasks();
                                    }}
                                    className="px-3 py-2 border rounded-lg"
                                >
                                    {[5, 10, 20, 50].map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {tasks.length === 0 ? (
                            <p className="text-gray-600">No tasks found</p>
                        ) : (
                            <>
                                <TaskList 
                                    tasks={tasks}
                                    onTaskSelected={(task) => setSelectedTask(task)}
                                />
                                
                                <div className="flex justify-between items-center mt-4 p-2 bg-gray-100 rounded-lg">
                                    <span>Showing {(currentPage * itemsPerPage) + 1} to {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems}</span>
                                    
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                            disabled={currentPage === 0}
                                            className="px-4 py-2 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        
                                        <span>Page {currentPage + 1}</span>

                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                                            className="px-4 py-2 ml-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

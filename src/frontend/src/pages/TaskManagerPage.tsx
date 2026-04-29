import { useState, useEffect } from 'react';
import { AddTaskModal } from '../components/AddTaskModal';
import { UpdateTask } from '../components/UpdateTask';
import { TaskCard } from '../components/TaskCard';
import { ErrorMessage } from '../components/ErrorMessage';
import taskApi from '../api/taskApi';
import { Task, TaskFormData } from '../types/task';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const TaskManagerPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>('id');
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  const loadTasks = async () => {
    try {
      setError(null);
      const response = await taskApi.getAllTasksWithPagination(
        currentPage,
        itemsPerPage,
        searchTerm,
        sortBy,
        orderBy === 'asc' ? 'asc' : 'desc'
      );
      
      setTasks(response.data.tasks);
      setTotalItems(response.data.totalItems || 0);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Failed to load tasks:', err);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const { connected } = await taskApi.checkConnection();
      if (!connected) {
        setIsBackendOffline(true);
        setError('Backend server is offline. Please ensure the Spring Boot app is running on port 8080.');
      } else {
        setIsBackendOffline(false);
        loadTasks();
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (!isBackendOffline) {
      loadTasks();
    }
  }, [currentPage, itemsPerPage, sortBy, orderBy, searchTerm]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setError(null);
      await taskApi.createTask(data);
      await loadTasks();
      setIsAddModalOpen(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create task. Please try again.';
      setError(errorMessage);
      throw err;
    }
  };

  const handleUpdateTask = async (id: number, data: TaskFormData) => {
    try {
      setError(null);
      await taskApi.updateTask(id, data);
      await loadTasks();
      setSelectedTask(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update task. Please try again.';
      setError(errorMessage);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setError(null);
      await taskApi.deleteTask(id);
      await loadTasks();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete task. Please try again.';
      setError(errorMessage);
    }
  };

  const handleUpdateTaskStatus = async (id: number, data: Partial<Task>) => {
    try {
      setError(null);
      await taskApi.updateTask(id, data as TaskFormData);
      await loadTasks();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update task status. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800">Task Manager</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
            <PlusIcon className="h-4 w-4" />
          Add Task
        </button>
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        {error && <ErrorMessage message={error} />}
        
        {selectedTask ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Edit Task</h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <UpdateTask 
              task={selectedTask}
              onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
            />
          </div>
        ) : null}

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div className="flex-grow min-w-[200px]">
              <label className="block text-xs-bold mb-1">Search</label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="input-modern"
              />
            </div>
            <div className="w-40">
              <label className="block text-xs-bold mb-1">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-modern"
              >
                <option value="id">ID</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="w-32">
              <label className="block text-xs-bold mb-1">Order</label>
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as 'asc' | 'desc')}
                className="select-modern"
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs-bold mb-1">Limit</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="select-modern"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {isBackendOffline ? 'Backend offline - cannot load tasks' : 'No tasks found'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task} 
                    onEdit={(task: Task) => setSelectedTask(task)}
                    onDelete={(id: number) => handleDeleteTask(id)}
                    onUpdate={handleUpdateTaskStatus}
                  />
                ))}
              </div>
              
              <div className="flex justify-center items-center mt-6 gap-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {currentPage + 1} of {Math.ceil(totalItems / itemsPerPage)}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
        
        <AddTaskModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={handleCreateTask} 
        />
      </main>
    </div>
  );
};

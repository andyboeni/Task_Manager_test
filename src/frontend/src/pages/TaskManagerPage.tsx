import { useState, useEffect } from 'react';
import { AddTaskModal } from '../components/AddTaskModal';
import { UpdateTask } from '../components/UpdateTask';
import { TaskCard } from '../components/TaskCard';
import { ErrorMessage } from '../components/ErrorMessage';
import taskApi from '../api/taskApi';
import { Task, TaskFormData } from '../types/task';
import { Plus, X } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
            <Plus className="h-6 w-6 text-white rotate-45 shrink-0" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">TaskFlow</h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary shadow-indigo-100 shadow-xl"
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </header>
      
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        {error && <ErrorMessage message={error} />}
        
        {selectedTask ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Edit Task</h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="h-5 w-5 shrink-0" />
              </button>
            </div>
            <UpdateTask 
              task={selectedTask}
              onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
            />
          </div>
        ) : null}

        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-4 flex-grow">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0);
                  }}
                  className="input-modern pl-4 h-11"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select-modern h-11 !w-32"
                >
                  <option value="id">Sort by ID</option>
                  <option value="title">Sort by Title</option>
                  <option value="status">Sort by Status</option>
                  <option value="priority">Sort by Priority</option>
                </select>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value as 'asc' | 'desc')}
                  className="select-modern h-11 !w-24"
                >
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {[5, 10, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setItemsPerPage(size);
                    setCurrentPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    itemsPerPage === size 
                    ? 'bg-indigo-600 text-white shadow-indigo-100 shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl py-20 text-center">
              <div className="mx-auto w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <Plus className="h-10 w-10 text-slate-300 shrink-0" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {isBackendOffline ? 'Backend is offline' : 'No tasks found'}
              </h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                {isBackendOffline 
                  ? 'Please ensure the Spring Boot application is running on port 8080.' 
                  : 'Try adjusting your search or filters, or create a new task to get started.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              
              <div className="flex justify-between items-center mt-10">
                <p className="text-sm text-slate-500 font-medium">
                  Showing <span className="text-slate-800">{tasks.length}</span> of <span className="text-slate-800">{totalItems}</span> tasks
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="btn-secondary h-10 w-10 !p-0 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <div className="flex items-center px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700">
                    Page {currentPage + 1}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                    className="btn-secondary h-10 w-10 !p-0 disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
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

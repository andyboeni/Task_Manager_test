import { useState, useEffect } from 'react';
import { AddTaskModal } from '../components/AddTaskModal';
import { UpdateTask } from '../components/UpdateTask';
import { TaskCard } from '../components/TaskCard';
import { ErrorMessage } from '../components/ErrorMessage';
import taskApi from '../api/taskApi';
import { Task, TaskFormData, TaskStatus } from '../types/task';

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
    loadTasks();
  }, [currentPage, itemsPerPage, sortBy, orderBy, searchTerm]);

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      setError(null);
      await taskApi.createTask(data);
      await loadTasks();
      setIsAddModalOpen(false);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async (id: number, data: TaskFormData) => {
    try {
      setError(null);
      await taskApi.updateTask(id, data);
      await loadTasks();
      setSelectedTask(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setError(null);
      await taskApi.deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Failed to delete task:', err);
    }
  };

  const handleUpdateTaskStatus = async (id: number, data: Partial<Task>) => {
    try {
      setError(null);
      await taskApi.updateTask(id, data as TaskFormData);
      await loadTasks();
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <div className="modern-layout min-h-screen">
      <header className="modern-header flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {error && <ErrorMessage message={error} />}
        
        {selectedTask ? (
          <div className="modern-section p-8 mb-8 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Edit Task</h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                ✕ Cancel
              </button>
            </div>
            <UpdateTask 
              task={selectedTask}
              onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
            />
          </div>
        ) : null}

        <div className="modern-section p-6">
          <div className="flex flex-wrap items-end mb-8 gap-4">
            <div className="flex-grow min-w-[300px]">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="input-modern"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sort by</label>
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
            <div className="w-full md:w-32">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Order</label>
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value as 'asc' | 'desc')}
                className="select-modern"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="w-full md:w-32">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Per page</label>
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
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 text-lg">No tasks found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or create a new task</p>
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
              
              <div className="flex justify-center items-center mt-8 gap-4">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="modern-pagination px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-slate-600 font-medium">
                  Page {currentPage + 1} of {Math.ceil(totalItems / itemsPerPage)}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                  className="modern-pagination px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
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

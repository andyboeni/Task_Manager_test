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
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="mb-4">Task Manager</h1>
      
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
      
      {error && <ErrorMessage message={error} />}
      
      {selectedTask ? (
        <div className="border rounded-lg shadow-md p-4 mt-4 bg-white">
          <h2 className="text-lg font-bold mb-2">Edit Task</h2>
          <div className="mt-2">
            <UpdateTask 
              task={selectedTask}
              onSubmit={(data) => handleUpdateTask(selectedTask.id, data)}
            />
            <button 
              onClick={() => setSelectedTask(null)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded mt-3 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="border rounded-lg shadow-md p-4 mt-4 bg-white">
        <div className="flex flex-wrap items-center mb-3 gap-4">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  setCurrentPage(0);
                  loadTasks();
                }
              }}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="w-full md:w-1/6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as 'asc' | 'desc')}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="w-full md:w-1/6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Items per page</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(0);
                loadTasks();
              }}
              className="border rounded px-3 py-2 w-full"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
              {tasks.map(task => (
                <div key={task.id} className="col-span-1">
                  <TaskCard 
                    task={task} 
                    onEdit={(task: Task) => setSelectedTask(task)}
                    onDelete={(id: number) => handleDeleteTask(id)}
                    onUpdate={handleUpdateTaskStatus}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 border rounded mr-2"
              >
                Previous
              </button>
              <span className="mx-2">{currentPage + 1}</span>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={(currentPage + 1) * itemsPerPage >= totalItems}
                className="px-3 py-1 border rounded ml-2"
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
    </div>
  );
};

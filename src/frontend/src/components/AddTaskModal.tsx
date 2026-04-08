import { useForm } from 'react-hook-form';
import { TaskFormData, TaskStatus, TaskPriority } from '../types/task';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export const AddTaskModal = ({ isOpen, onClose, onSubmit }: AddTaskModalProps) => {
  const { 
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<TaskFormData>();

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form 
          className="space-y-4 p-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Title must be at most 100 characters'
                }
              })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be at most 500 characters'
                }
              })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter task description"
              rows={3}
            />
            {errors.description?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('status', {
                required: 'Status is required'
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              {...register('priority', {
                required: 'Priority is required'
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

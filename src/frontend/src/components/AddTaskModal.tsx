import { useForm } from 'react-hook-form';
import { TaskFormData, TaskStatus, TaskPriority } from '../types/task';

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modern-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800">Create New Task</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter task title..."
                {...register('title', { required: true, maxLength: 100 })}
                className={`input-modern ${errors.title ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.title.message || 'Title is required'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                rows={3}
                placeholder="Add more details..."
                {...register('description', { maxLength: 500 })}
                className={`input-modern resize-none ${errors.description ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-rose-600">
                  {errors.description.message || 'Description must be at most 500 characters'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('status', { required: true })}
                  className={`select-modern ${errors.status ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
                >
                  <option value="">Select status</option>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-rose-600">Status is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('priority', { required: true })}
                  className={`select-modern ${errors.priority ? 'border-rose-500 focus:ring-rose-500/20' : ''}`}
                >
                  <option value="">Select priority</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-rose-600">Priority is required</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="input-modern"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

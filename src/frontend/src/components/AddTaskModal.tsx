import { useForm } from 'react-hook-form';
import { TaskFormData } from '../types/task';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export const AddTaskModal = ({ isOpen, onClose, onSubmit }: AddTaskModalProps) => {
  const { 
    register,
    formState: { errors, isSubmitting },
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Create Task</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs-bold mb-1">Title *</label>
              <input
                type="text"
                placeholder="Enter task title..."
                {...register('title', { required: true, maxLength: 100 })}
                className={`input-modern ${errors.title ? 'border-rose-500' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-500">Title required</p>
              )}
            </div>

            <div>
              <label className="block text-xs-bold mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Add more details..."
                {...register('description', { maxLength: 500 })}
                className={`input-modern resize-none ${errors.description ? 'border-rose-500' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs-bold mb-1">Status *</label>
                <select
                  {...register('status', { required: true })}
                  className={`select-modern ${errors.status ? 'border-rose-500' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-rose-500">Status required</p>
                )}
              </div>

              <div>
                <label className="block text-xs-bold mb-1">Priority *</label>
                <select
                  {...register('priority', { required: true })}
                  className={`select-modern ${errors.priority ? 'border-rose-500' : ''}`}
                >
                  <option value="">Select</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-xs text-rose-500">Priority required</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs-bold mb-1">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="input-modern"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

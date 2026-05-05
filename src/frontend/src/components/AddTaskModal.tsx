import { X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Create New Task</h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all"
          >
            <X className="h-5 w-5 shrink-0" />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs-bold mb-1.5">Task Title *</label>
              <input
                type="text"
                placeholder="e.g. Design system update"
                {...register('title', { required: true, maxLength: 100 })}
                className={`input-modern h-11 ${errors.title ? 'border-rose-500 ring-rose-500/10 focus:ring-rose-500/20 focus:border-rose-500' : ''}`}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs font-semibold text-rose-500 flex items-center gap-1">
                  <span className="shrink-0">⚠</span> Title is required (max 100 chars)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs-bold mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Briefly describe the task goals..."
                {...register('description', { maxLength: 500 })}
                className={`input-modern resize-none ${errors.description ? 'border-rose-500' : ''}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs-bold mb-1.5">Status *</label>
                <select
                  {...register('status', { required: true })}
                  className={`select-modern h-11 ${errors.status ? 'border-rose-500' : ''}`}
                >
                  <option value="">Select Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-xs-bold mb-1.5">Priority *</label>
                <select
                  {...register('priority', { required: true })}
                  className={`select-modern h-11 ${errors.priority ? 'border-rose-500' : ''}`}
                >
                  <option value="">Select Priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs-bold mb-1.5">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="input-modern h-11"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </div>
                ) : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

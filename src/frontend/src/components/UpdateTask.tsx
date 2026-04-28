import { useForm } from 'react-hook-form';
import { Task, TaskFormData } from '../types/task';

interface UpdateTaskProps {
  task: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export const UpdateTask = ({ task, onSubmit }: UpdateTaskProps) => {
  const { 
    register,
    formState: { errors },
    handleSubmit
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs-bold mb-1">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 100,
              message: 'Title must be at most 100 characters'
            }
          })}
          className={`input-modern ${errors.title ? 'border-rose-500' : ''}`}
        />
        {errors.title && (
          <p className="text-xs text-rose-500 mt-1">{errors.title.message || 'Title is required'}</p>
        )}
      </div>

      <div>
        <label className="block text-xs-bold mb-1">Description</label>
        <textarea
          rows={2}
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must be at most 500 characters'
            }
          })}
          className={`input-modern resize-none ${errors.description ? 'border-rose-500' : ''}`}
        />
        {errors.description && (
          <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs-bold mb-1">
            Status <span className="text-rose-500">*</span>
          </label>
          <select
            {...register('status', {
              required: 'Status is required'
            })}
            className={`select-modern ${errors.status ? 'border-rose-500' : ''}`}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {errors.status && (
            <p className="text-xs text-rose-500 mt-1">{errors.status.message || 'Status is required'}</p>
          )}
        </div>

        <div>
          <label className="block text-xs-bold mb-1">
            Priority <span className="text-rose-500">*</span>
          </label>
          <select
            {...register('priority', {
              required: 'Priority is required'
            })}
            className={`select-modern ${errors.priority ? 'border-rose-500' : ''}`}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {errors.priority && (
            <p className="text-xs text-rose-500 mt-1">{errors.priority.message || 'Priority is required'}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
      >
        Save Changes
      </button>
    </form>
  );
};

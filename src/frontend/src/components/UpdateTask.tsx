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
      assignee: task.assignee,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-xs-bold mb-1.5">
          Task Title *
        </label>
        <input
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 100,
              message: 'Title must be at most 100 characters'
            }
          })}
          className={`input-modern h-11 ${errors.title ? 'border-rose-500 ring-rose-500/10' : ''}`}
        />
        {errors.title && (
          <p className="text-xs font-semibold text-rose-500 mt-1.5">{errors.title.message || 'Title is required'}</p>
        )}
      </div>

      <div>
        <label className="block text-xs-bold mb-1.5">Description</label>
        <textarea
          rows={3}
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must be at most 500 characters'
            }
          })}
          className={`input-modern resize-none ${errors.description ? 'border-rose-500 ring-rose-500/10' : ''}`}
        />
        {errors.description && (
          <p className="text-xs font-semibold text-rose-500 mt-1.5">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs-bold mb-1.5">
            Status *
          </label>
          <select
            {...register('status', {
              required: 'Status is required'
            })}
            className={`select-modern h-11 ${errors.status ? 'border-rose-500 ring-rose-500/10' : ''}`}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-xs-bold mb-1.5">
            Priority *
          </label>
          <select
            {...register('priority', {
              required: 'Priority is required'
            })}
            className={`select-modern h-11 ${errors.priority ? 'border-rose-500 ring-rose-500/10' : ''}`}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs-bold mb-1.5">Assignee</label>
        <input
          {...register('assignee', {
            maxLength: {
              value: 100,
              message: 'Assignee name must be at most 100 characters'
            }
          })}
          className={`input-modern h-11 ${errors.assignee ? 'border-rose-500 ring-rose-500/10' : ''}`}
          placeholder="Who's working on this?"
        />
        {errors.assignee && (
          <p className="text-xs font-semibold text-rose-500 mt-1.5">{errors.assignee.message}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full h-11"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

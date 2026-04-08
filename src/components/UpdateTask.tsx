import React from 'react';
import { Task, TaskFormData } from '../types/task';

interface UpdateTaskProps {
  task: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ task, onSubmit, onCancel }) => {
  // Implementation would go here
  return null;
};

export default UpdateTask;

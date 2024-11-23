import { createTask } from './create';
import { getTasksByUser } from './get';
import { updateTaskStatus } from './status';
import { completeTask } from './complete';
import { submitTaskRating } from './rating';

export const tasksService = {
  create: createTask,
  getByUser: getTasksByUser,
  accept: updateTaskStatus.accept,
  start: updateTaskStatus.start,
  complete: completeTask,
  submitRating: submitTaskRating
};
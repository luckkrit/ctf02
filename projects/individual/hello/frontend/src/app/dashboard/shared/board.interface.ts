import { Todo } from './todo.interface';

export interface Board {
  id: string;
  title: string;
  todos: Todo[];
  userId: number;
}

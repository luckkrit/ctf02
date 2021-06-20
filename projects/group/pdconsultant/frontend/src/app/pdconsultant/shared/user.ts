import { Queue } from './queue';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  roles: any;
  queues: Queue[];
}

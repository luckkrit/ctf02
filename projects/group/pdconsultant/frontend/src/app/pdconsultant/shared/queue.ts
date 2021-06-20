import { Symptom } from './symptom';
import { Doctor } from './doctor';
import { User } from './user';

export interface Queue {
  id: number;
  title: string;
  user: User;
  symptom: Symptom;
  doctor: Doctor;
}

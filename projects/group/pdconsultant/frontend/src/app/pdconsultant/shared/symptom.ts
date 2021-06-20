import { Specialty } from './specialty';

export interface Symptom {
  id: number;
  title: string;
  specialty: Specialty;
}

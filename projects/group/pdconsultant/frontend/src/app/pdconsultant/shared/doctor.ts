import { Specialty } from './specialty';

export interface Doctor {
  id: number;
  specialty: Specialty;
  user: any;
}

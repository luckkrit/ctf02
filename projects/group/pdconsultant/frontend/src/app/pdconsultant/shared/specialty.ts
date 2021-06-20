import { Doctor } from './doctor';
import { Symptom } from './symptom';

export interface Specialty {
  id: number;
  title: string;
  doctors: Doctor[];
  symptom: Symptom;
}

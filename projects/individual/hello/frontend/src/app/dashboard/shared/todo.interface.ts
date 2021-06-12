import { Card } from './card.interface';

export interface Todo {
  id: string;
  title: string;
  boardId: string;
  ordinal: number;
  cards: Card[];
}

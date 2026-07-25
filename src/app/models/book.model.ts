export interface Choice {
  id: number;
  description: string;
  goToId: number | null;
  consequence?: {
    type: 'LOSE_HEALTH' | 'GAIN_HEALTH';
    value: number;
    text: string;
  };
  tag?: string;
}

export interface Section {
  id: number;
  title?: string;
  text: string;
  type: 'BEGIN' | 'NODE' | 'END';
  options: Choice[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: string;
  tags: tag[];
  category: string;
  chapters: number;
  sections: Section[];
  valid?: boolean;
}

interface tag {
  name: string;
}
export interface ResponseBook {
  content: Book[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;

}
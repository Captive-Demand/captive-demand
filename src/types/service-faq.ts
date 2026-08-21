import type { ReactNode } from 'react';

export interface ServiceFaqItem {
  question: string;
  answer: ReactNode;
  tags: string[];
}

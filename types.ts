export type Category = 'hook' | 'objection' | 'closing' | 'learning';

export interface Scenario {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  tags: string[];
  oneLiner: string; // Level 1
  logic: string;    // Level 2
  sop: string;      // Level 3
  clipTime?: string;// Level 4 placeholder
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface BattleState {
  isActive: boolean;
  currentScenario: Scenario | null;
  userAnswer: string;
  feedback: string | null;
  isEvaluating: boolean;
}
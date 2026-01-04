// ============================================
// API Types - Shared type definitions
// ============================================
// These types mirror the kami-backend response schemas

// ============================================
// Portfolio Module Types
// ============================================

export interface ProposalReply {
  id: string;
  message: string;
  sentAt: string;
  resendId?: string;
}

export interface Proposal {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  replies: ProposalReply[];
  ipAddress?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProposalListResponse {
  proposals: Proposal[];
  unreadCount: number;
  total: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export interface ContactResponse {
  success: boolean;
  id?: string;
  message: string;
}

export interface ReplyData {
  message: string;
}

export interface ReplyResponse {
  success: boolean;
  id?: string;
  message: string;
  error?: string;
}

// ============================================
// Personal App - Ecosystem Module Types
// ============================================

export type OrbStyle = 'default' | 'aurora' | 'nebula' | 'stellar' | 'void';

export interface Ecosystem {
  level: number;
  currentLight: number;
  totalLight: number;
  todayLight: number;
  streak: number;
  bestStreak: number;
  lastActiveDate: string;
  orbStyle: OrbStyle;
}

export interface LightTransaction {
  id: string;
  type: 'task_complete' | 'goal_complete' | 'streak_bonus' | 'habit_complete';
  amount: number;
  multiplier: number;
  timestamp: number;
  description: string;
}

// ============================================
// Personal App - Todo Module Types
// ============================================

export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoCategory = 'personal' | 'work' | 'health' | 'learning' | 'other';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  goalId?: string;
  dueDate?: number;
  createdAt: number;
  completedAt?: number;
  order: number;
  lightValue: number;
}

export interface TodoCreateData {
  title: string;
  description?: string;
  priority: TodoPriority;
  category: TodoCategory;
  goalId?: string;
  dueDate?: number;
  order: number;
  lightValue: number;
}

export interface TodoUpdateData {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  category?: TodoCategory;
  completed?: boolean;
  order?: number;
}

// ============================================
// Personal App - Goal Module Types
// ============================================

export type GoalStatus = 'active' | 'completed' | 'archived' | 'paused';
export type GoalCategory = 'personal' | 'career' | 'health' | 'financial' | 'social' | 'learning' | 'creative';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority: GoalPriority;
  icon?: string;
  status: GoalStatus;
  progress: number;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate?: string;
  targetDate?: string;
  completedAt?: string;
  lightReward: number;
  linkedTodoIds?: string[];
  constellation?: string;
  createdAt: number;
  updatedAt: number;
}

export interface GoalCreateData {
  title: string;
  description?: string;
  category: GoalCategory;
  priority: GoalPriority;
  icon?: string;
  targetValue?: number;
  unit?: string;
  startDate?: string;
  targetDate?: string;
  lightReward?: number;
}

// ============================================
// Personal App - Habit Module Types
// ============================================

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color?: string;
  frequency: HabitFrequency;
  customDays?: number[];
  createdAt: number;
  streak: number;
  bestStreak: number;
  lightValue: number;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: number;
}

// ============================================
// Personal App - Calorie Module Types
// ============================================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface FoodItem {
  name: string;
  calories: number;
  confidence: ConfidenceLevel;
}

export interface CalorieEntry {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  foods: FoodItem[];
  totalCalories: number;
  notes?: string;
  createdAt: number;
}

export interface CalorieAnalyzeRequest {
  description?: string;
  image?: string; // Base64 encoded image
}

export interface CalorieAnalyzeResponse {
  foods: FoodItem[];
  totalCalories: number;
  mealType: MealType;
}

export interface DailyCalorieSummary {
  date: string;
  totalCalories: number;
  meals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  entries: CalorieEntry[];
}

// ============================================
// Personal App - Photo Journal Module Types
// ============================================

export type Feeling = 'amazing' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface PhotoEntry {
  id: string;
  dayNumber: number;
  yearNumber: number;
  date: string;
  photoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  feeling?: Feeling;
  location?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface PhotoJournalMeta {
  startDate: string;
  totalPhotos: number;
  currentStreak: number;
  longestStreak: number;
  lastPhotoDate?: string;
}

// ============================================
// Personal App - Secret Vault Module Types
// ============================================

export interface VaultItem {
  id: string;
  type: 'password' | 'note' | 'card' | 'document';
  title: string;
  encryptedData: string;
  category?: string;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// AI Module Types
// ============================================

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  response: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}


export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Attachment {
  type: 'image' | 'file';
  content: string; // Base64 string
  mimeType: string;
  name?: string; // Added for document display
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
  groundingSupports?: any[];
  searchEntryPoint?: any;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  attachments?: Attachment[]; // Changed from single attachment to array
  groundingMetadata?: GroundingMetadata;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  lastModelId?: string; // Track which model was used
}

export interface UserProfile {
  name: string;
  bio: string;
  isLoggedIn: boolean;
}

// Updated Model Types for Pollinations
export enum ModelType {
  POLLINATIONS_GPT4O = 'openai', // Maps to GPT-4o via Pollinations
  POLLINATIONS_CLAUDE = 'claude', // Maps to Claude 3.5 Sonnet via Pollinations
  POLLINATIONS_MISTRAL = 'mistral',
  POLLINATIONS_LLAMA = 'llama',
  POLLINATIONS_GEMINI = 'gemini' // Pollinations proxy for Gemini
}

export type BrandType = 'velicia';

export interface ModelOption {
  id: string; 
  label: string;
  description?: string;
  category: 'text' | 'image'; 
  brand: BrandType;
}

// Cleaned up DEFAULT_MODELS to focus on Pollinations
export const DEFAULT_MODELS: ModelOption[] = [
  { 
    id: ModelType.POLLINATIONS_GPT4O, 
    label: 'Velicia GPT-4o', 
    description: 'Cerdas & Vision (Premium)', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.POLLINATIONS_CLAUDE, 
    label: 'Velicia Claude 3.5', 
    description: 'Coding & Humanis (Premium)', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.POLLINATIONS_GEMINI, 
    label: 'Velicia Gemini 2.0', 
    description: 'Google DeepMind', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.POLLINATIONS_MISTRAL, 
    label: 'Velicia Mistral', 
    description: 'Cepat & Ringan', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.POLLINATIONS_LLAMA, 
    label: 'Velicia Llama 3.3', 
    description: 'Open Source Meta', 
    category: 'text',
    brand: 'velicia'
  }
];

export interface PresentationConfig {
  topic: string;
  cardCount: number;
  modelId: string;
  imageSource: 'ai_generated' | 'google_search';
  language: string;
}

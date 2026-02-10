
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Attachment {
  type: 'image' | 'file' | 'video' | 'audio';
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

export enum ModelType {
  // Use internal stable IDs, map to API models in service
  GEN2_REASONING = 'velicia-reasoning', // Maps to gemini-3-pro-preview + CoT Prompt
  GEN2_V2_5 = 'velicia-flash', // Maps to gemini-3-flash-preview
  GEN2_PRO = 'velicia-pro' // Maps to gemini-3-pro-preview (Docs focus)
}

export type BrandType = 'velicia';

export interface ModelOption {
  id: string; 
  label: string;
  description?: string;
  category: 'text'; 
  brand: BrandType;
}

export const DEFAULT_MODELS: ModelOption[] = [
  { 
    id: ModelType.GEN2_REASONING, 
    label: 'Gen2 Deep', 
    description: 'Logika Kompleks • Coding • Analisis Mendalam', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.GEN2_V2_5, 
    label: 'Gen2 Flash', 
    description: 'Cepat • Google Search • Real-time Info', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.GEN2_PRO, 
    label: 'Gen2 Docs', 
    description: 'Analisis Dokumen Besar (PDF/Excel)', 
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

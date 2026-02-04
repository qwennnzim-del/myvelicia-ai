
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
}

export interface UserProfile {
  name: string;
  bio: string;
  isLoggedIn: boolean;
}

export enum ModelType {
  GEN2_V2_5 = 'gemini-3-flash-preview',
  GEN2_V1_0 = 'gemini-flash-latest'
}

export type BrandType = 'velicia';

export interface ModelOption {
  id: string; 
  label: string;
  description?: string;
  category: 'text' | 'image'; 
  brand: BrandType;
}

export const DEFAULT_MODELS: ModelOption[] = [
  { 
    id: ModelType.GEN2_V2_5, 
    label: 'Gen2 v2.0', 
    description: 'Penalaran & Pemecahan Masalah', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.GEN2_V1_0, 
    label: 'Gen2 v1.0', 
    description: 'Cepat & Efisien', 
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

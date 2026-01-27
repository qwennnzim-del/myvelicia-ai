
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

export enum ModelType {
  VELICIA_PRO = 'gemini-2.5-flash',      // Deepthink & Reasoning
  VELICIA_FLASH = 'gemini-2.5-flash-lite',    // Efficient & Smart
  VELICIA_LITE = 'gemini-flash-latest'   // Fast & Low Latency
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
    id: ModelType.VELICIA_PRO, 
    label: 'Velicia 3.5 Pro', 
    description: 'Deepthink & Reasoning', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.VELICIA_FLASH, 
    label: 'Velicia 3.5 Flash', 
    description: 'Efficient & Smart', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.VELICIA_LITE, 
    label: 'Velicia 1.5 Lite', 
    description: 'Fast & Low Latency', 
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

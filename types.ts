
export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Attachment {
  type: 'image';
  content: string; // Base64 string
  mimeType: string;
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
  attachment?: Attachment; 
  groundingMetadata?: GroundingMetadata;
}

export enum ModelType {
  // --- LATEST GEMINI MODELS ---
  GEMINI_3_FLASH = 'gemini-3-flash-preview', 
  GEMINI_3_PRO = 'gemini-3-pro-preview',     
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',     
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
    id: ModelType.GEMINI_3_PRO, 
    label: 'Velicia Pro', 
    description: 'Advanced Intelligence', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.GEMINI_3_FLASH, 
    label: 'Velicia Fast', 
    description: 'High-Speed Response', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.GEMINI_2_5_FLASH, 
    label: 'Velicia Lite', 
    description: 'Efficient & Precise', 
    category: 'text',
    brand: 'velicia'
  }
];

// Presentation Feature Types
export type SlideLayout = 'title_modern' | 'image_focus' | 'big_number' | 'features_grid' | 'two_column';

export interface Slide {
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  content: string[];
  imageUrl?: string;
  imageStatus?: 'loading' | 'generated' | 'failed';
  visualDescription?: string;
  searchQuery?: string;
  highlightMetric?: string;
  speakerNotes?: string;
}

export interface PresentationConfig {
  topic: string;
  cardCount: number;
  modelId: string;
  imageSource: 'ai_generated' | 'google_search';
  language: string;
}

export interface PresentationData {
  slides: Slide[];
  config: PresentationConfig;
  theme: string;
}


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
  GEMINI_3_FLASH = 'gemini-3-flash-preview', // Basic Text Tasks (Fastest)
  GEMINI_3_PRO = 'gemini-3-pro-preview',     // Complex Reasoning
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',     // Stable previous version
  
  // --- IMAGE MODELS ---
  IMAGE_FLASH = 'gemini-2.5-flash-image',          // General Image Gen
  IMAGE_PRO = 'gemini-3-pro-image-preview',        // High Quality Image Gen
  
  // --- EXTERNAL MODELS (MAPPED) ---
  GPT4O = 'gpt-4o',
  GPT5_MINI = 'gpt-4o-mini', 
  DEEPSEEK = 'deepseek',
}

export type BrandType = 'velicia' | 'google' | 'openai' | 'deepseek' | 'flux' | 'midjourney' | 'stability' | 'pollinations';

export interface ModelOption {
  id: string; 
  label: string;
  description?: string;
  category: 'text' | 'image'; 
  brand: BrandType;
}

export const DEFAULT_MODELS: ModelOption[] = [
  { 
    id: ModelType.GEMINI_3_FLASH, 
    label: 'Velicia AI (3.0)', 
    description: 'Ultra Fast & Smart', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.GEMINI_3_PRO, 
    label: 'Gemini 3.0 Pro', 
    description: 'Reasoning & Coding', 
    category: 'text',
    brand: 'google'
  },
  { 
    id: ModelType.GEMINI_2_5_FLASH, 
    label: 'Gemini 2.5 Flash', 
    description: 'Stable & Balanced', 
    category: 'text',
    brand: 'google'
  },
  { 
    id: ModelType.IMAGE_FLASH, 
    label: 'Gemini Flash Image', 
    description: 'Fast Gen Image', 
    category: 'image',
    brand: 'google'
  },
  { 
    id: ModelType.IMAGE_PRO, 
    label: 'Gemini Pro Vision', 
    description: 'High Quality Image', 
    category: 'image',
    brand: 'google'
  },
  { 
    id: ModelType.GPT4O, 
    label: 'GPT-4o', 
    description: 'OpenAI Omnimodel', 
    category: 'text',
    brand: 'openai'
  },
  { 
    id: ModelType.DEEPSEEK, 
    label: 'DeepSeek V3', 
    description: 'Coding & Logic', 
    category: 'text',
    brand: 'deepseek'
  },
  { 
    id: 'flux', 
    label: 'Flux Schnell', 
    description: 'Standard Speed', 
    category: 'image',
    brand: 'flux'
  },
  { 
    id: 'midjourney', 
    label: 'Midjourney', 
    description: 'Artistic & Detailed', 
    category: 'image',
    brand: 'midjourney'
  },
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

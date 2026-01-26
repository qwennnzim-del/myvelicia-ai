
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
  FLASH_LITE = 'gemini-2.0-flash', // Updated to 2.0 Flash as requested (closest to stable 2.5 request)
  FLASH = 'gemini-2.0-flash',
  PRO = 'gemini-2.0-pro-exp-02-05', 
  IMAGE_FLASH = 'gemini-2.5-flash-image', 
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
    id: ModelType.FLASH_LITE, 
    label: 'Velicia AI', 
    description: 'Smart & Fast (Gemini 2.0)', 
    category: 'text',
    brand: 'velicia'
  },
  { 
    id: ModelType.PRO, 
    label: 'Gemini 2.0 Pro', 
    description: 'Complex Reasoning', 
    category: 'text',
    brand: 'google'
  },
  { 
    id: ModelType.FLASH, 
    label: 'Gemini 2.0 Flash', 
    description: 'Fast & Versatile', 
    category: 'text',
    brand: 'google'
  },
  { 
    id: ModelType.IMAGE_FLASH, 
    label: 'Gemini Flash Image', 
    description: 'Fast Gen Image (Free)', 
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
    id: ModelType.GPT5_MINI, 
    label: 'GPT-4o Mini', 
    description: 'Lightweight & Efficient', 
    category: 'text',
    brand: 'openai'
  },
  { 
    id: ModelType.DEEPSEEK, 
    label: 'DeepSeek V3', 
    description: 'Coding & Logic Expert', 
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
  { 
    id: 'gptimage-large', 
    label: 'DALL·E 3', 
    description: 'High Quality', 
    category: 'image',
    brand: 'openai'
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

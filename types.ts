
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
  VELICIA_PRO = 'gemini-2.5-flash-native-audio-preview-12-2025', // Mapping "Deepthink & Reasoning" to high-end preview
  VELICIA_FLASH = 'gemini-2.0-flash-exp',                        // Mapping "Efficient & Smart"
  VELICIA_LITE = 'gemini-flash-latest',                         // "Fast & Low Latency"
  GEMINI_3_FLASH = 'gemini-3-flash-preview',
  GEMINI_3_PRO = 'gemini-3-pro-preview'
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

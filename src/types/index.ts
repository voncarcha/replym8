// Global type definitions

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Database Types

export interface User {
  id: string; // text
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: Date;
}

export type ProfileType = 'individual' | 'group';

export interface Profile {
  id: string; // UUID
  user_id: string; // text
  name: string;
  description: string | null;
  type: ProfileType;
  tone_preferences: Record<string, unknown>; // JSONB
  created_at: Date;
}

export interface ProfileMember {
  id: string; // UUID
  profile_id: string; // UUID
  name: string;
  email: string | null;
  role: string | null;
  created_at: Date;
}

export type MemorySource = 'paste' | 'ocr';

export interface Memory {
  id: string; // UUID
  profile_id: string; // UUID
  source: MemorySource;
  text_summary: string;
  raw_encrypted_blob: Buffer | null; // BYTEA
  created_at: Date;
}

export interface Embedding {
  id: string; // UUID
  memory_id: string; // UUID
  profile_id: string; // UUID
  vector_id: string;
  created_at: Date;
}

export interface GeneratedReply {
  id: string; // UUID
  profile_id: string; // UUID
  user_id: string; // text
  prompt_payload: Record<string, unknown>; // JSONB
  model_response: string;
  created_at: Date;
}


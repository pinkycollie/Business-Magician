import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlatformConnection } from '@shared/platformSyncSchema';

/**
 * Creates a Supabase client from a platform connection's credentials.
 */
export function createSupabaseClient(connection: PlatformConnection): SupabaseClient {
  const { url, anonKey } = connection.credentials as { url: string, anonKey: string };
  
  if (!url || !anonKey) {
    throw new Error('Supabase URL and Anon Key are required in credentials');
  }
  
  return createClient(url, anonKey);
}

/**
 * Tests the connection to Supabase by attempting to list buckets.
 */
export async function testSupabaseConnection(connection: PlatformConnection): Promise<boolean> {
  try {
    const supabase = createSupabaseClient(connection);
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}

/**
 * Interface for Supabase file metadata.
 */
export interface SupabaseFileMetadata {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

/**
 * Lists all files in a Supabase bucket/path.
 */
export async function listSupabaseFiles(
  connection: PlatformConnection,
  bucket: string,
  path: string = ''
): Promise<any[]> {
  const supabase = createSupabaseClient(connection);
  
  const { data, error } = await supabase.storage.from(bucket).list(path, {
    recursive: true
  });
  
  if (error) {
    throw error;
  }
  
  return data || [];
}

/**
 * Uploads a file to Supabase storage.
 */
export async function uploadToSupabase(
  connection: PlatformConnection,
  bucket: string,
  path: string,
  content: Buffer | Blob | ArrayBuffer | string
): Promise<{ data: any; error: any }> {
  const supabase = createSupabaseClient(connection);
  
  const { data, error } = await supabase.storage.from(bucket).upload(path, content, {
    upsert: true
  });
  
  return { data, error };
}

/**
 * Downloads a file from Supabase storage.
 */
export async function downloadFromSupabase(
  connection: PlatformConnection,
  bucket: string,
  path: string
): Promise<Blob> {
  const supabase = createSupabaseClient(connection);
  
  const { data, error } = await supabase.storage.from(bucket).download(path);
  
  if (error) {
    throw error;
  }
  
  return data;
}

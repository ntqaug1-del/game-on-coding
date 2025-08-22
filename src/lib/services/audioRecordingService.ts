import { supabase } from "@/integrations/supabase/client";

export interface AudioRecording {
  id?: string;
  user_id?: string; // Không còn bắt buộc
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  file_path: string;
  public_url: string;
  duration?: number;
  voice: string;
  speed: number;
  text_content: string;
  created_at?: string;
  updated_at?: string;
  session_id?: string; // Thêm session_id để phân biệt bản ghi của các phiên khác nhau
}

export interface AudioRecordingFilter {
  category?: string;
  searchTerm?: string;
  sortBy?: 'created_at' | 'title' | 'duration';
  sortOrder?: 'asc' | 'desc';
  session_id?: string; // Thêm session_id để lọc theo phiên
}

export const audioRecordingService = {
  // Lưu bản ghi âm mới
  async saveRecording(recording: AudioRecording): Promise<AudioRecording | null> {
    try {
      const { data, error } = await supabase
        .from('audio_recordings')
        .insert(recording)
        .select()
        .single();

      if (error) {
        console.error('Error saving recording:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in saveRecording:', error);
      throw error;
    }
  },

  // Lấy tất cả bản ghi âm của phiên hiện tại hoặc tất cả bản ghi
  async getUserRecordings(filter?: AudioRecordingFilter): Promise<AudioRecording[]> {
    try {
      let query = supabase
        .from('audio_recordings')
        .select('*');

      // Áp dụng bộ lọc nếu có
      if (filter) {
        // Lọc theo session_id nếu có
        if (filter.session_id) {
          // Sử dụng is.null nếu session_id không tồn tại trong bảng
          try {
            query = query.eq('session_id', filter.session_id);
          } catch (error) {
            console.warn('Filtering by session_id failed, might be missing in table:', error);
            // Không áp dụng bộ lọc nếu có lỗi
          }
        }

        if (filter.category) {
          query = query.eq('category', filter.category);
        }

        if (filter.searchTerm) {
          query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%,text_content.ilike.%${filter.searchTerm}%`);
        }

        if (filter.sortBy) {
          query = query.order(filter.sortBy, { ascending: filter.sortOrder === 'asc' });
        } else {
          query = query.order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recordings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserRecordings:', error);
      throw error;
    }
  },

  // Lấy chi tiết một bản ghi âm
  async getRecording(id: string): Promise<AudioRecording | null> {
    try {
      const { data, error } = await supabase
        .from('audio_recordings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recording:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getRecording:', error);
      throw error;
    }
  },

  // Cập nhật thông tin bản ghi âm
  async updateRecording(id: string, updates: Partial<AudioRecording>): Promise<AudioRecording | null> {
    try {
      const { data, error } = await supabase
        .from('audio_recordings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating recording:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateRecording:', error);
      throw error;
    }
  },

  // Xóa bản ghi âm
  async deleteRecording(id: string): Promise<void> {
    try {
      // Lấy thông tin file trước khi xóa
      const { data: recording } = await supabase
        .from('audio_recordings')
        .select('file_path')
        .eq('id', id)
        .single();

      if (recording && recording.file_path) {
        // Xóa file từ storage
        const { error: storageError } = await supabase.storage
          .from('audio-files')
          .remove([recording.file_path]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }

      // Xóa bản ghi từ database
      const { error } = await supabase
        .from('audio_recordings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting recording:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteRecording:', error);
      throw error;
    }
  },

  // Lấy danh sách các danh mục
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('audio_recordings')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Lọc các danh mục duy nhất
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  }
};

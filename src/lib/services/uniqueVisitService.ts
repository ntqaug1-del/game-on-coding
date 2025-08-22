import { supabase } from '@/integrations/supabase/client';

/**
 * Lấy địa chỉ IP của người dùng
 * Lưu ý: Trong môi trường thực tế, IP sẽ được lấy từ server-side
 * Hàm này chỉ là giải pháp tạm thời cho client-side
 * @returns Promise<string> Địa chỉ IP hoặc một ID ngẫu nhiên nếu không lấy được IP
 */
export const getUserIP = async (): Promise<string> => {
  try {
    // Sử dụng service bên ngoài để lấy IP
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting user IP:', error);
    // Nếu không lấy được IP, tạo một ID ngẫu nhiên dựa trên thông tin trình duyệt
    // Đây không phải là cách lý tưởng nhưng có thể dùng tạm
    const browserInfo = navigator.userAgent + navigator.language;
    const randomId = Math.random().toString(36).substring(2, 15);
    return `anonymous-${randomId}`;
  }
};

/**
 * Ghi lại lượt truy cập mới nếu IP chưa truy cập trong ngày hôm nay
 * @param pageName Tên trang
 * @param ipAddress Địa chỉ IP của người dùng
 * @returns Promise<boolean> True nếu đây là lượt truy cập mới, False nếu IP đã truy cập trong ngày
 */
export const logUniqueVisit = async (pageName: string, ipAddress: string): Promise<boolean> => {
  try {
    // Kiểm tra xem IP này đã truy cập trang này trong ngày hôm nay chưa
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const { data: existingVisit, error: checkError } = await supabase
      .from('visit_logs')
      .select('id')
      .eq('page_name', pageName)
      .eq('ip_address', ipAddress)
      .eq('visit_date', today)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing visit:', checkError);
      return false;
    }
    
    // Nếu IP này chưa truy cập trang này trong ngày hôm nay
    if (!existingVisit) {
      // Ghi lại lượt truy cập mới
      const { error: insertError } = await supabase
        .from('visit_logs')
        .insert({
          page_name: pageName,
          ip_address: ipAddress,
          visit_date: today
        });
      
      if (insertError) {
        console.error('Error logging visit:', insertError);
        return false;
      }
      
      // Cập nhật bảng visit_counter (giữ lại để tương thích với code cũ)
      await updateVisitCounter(pageName);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in logUniqueVisit:', error);
    return false;
  }
};

/**
 * Cập nhật bộ đếm lượt truy cập
 * @param pageName Tên trang
 */
const updateVisitCounter = async (pageName: string): Promise<void> => {
  try {
    // Lấy số lượng lượt truy cập hiện tại
    const { data: currentData, error: fetchError } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('page_name', pageName)
      .single();
    
    if (fetchError) {
      console.error('Error fetching visit counter:', fetchError);
      return;
    }
    
    const currentCount = currentData?.count || 0;
    const newCount = currentCount + 1;
    
    // Cập nhật bộ đếm
    const { error: updateError } = await supabase
      .from('visit_counter')
      .update({
        count: newCount,
        last_updated: new Date().toISOString()
      })
      .eq('page_name', pageName);
    
    if (updateError) {
      console.error('Error updating visit counter:', updateError);
    }
  } catch (error) {
    console.error('Error in updateVisitCounter:', error);
  }
};

/**
 * Lấy tổng số lượt truy cập duy nhất cho một trang
 * @param pageName Tên trang
 * @returns Promise<number> Tổng số lượt truy cập duy nhất
 */
export const getTotalUniqueVisits = async (pageName: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('visit_logs')
      .select('id', { count: 'exact', head: true })
      .eq('page_name', pageName);
    
    if (error) {
      console.error('Error getting total unique visits:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTotalUniqueVisits:', error);
    return 0;
  }
};

/**
 * Lấy số lượt truy cập duy nhất trong ngày hôm nay
 * @param pageName Tên trang
 * @returns Promise<number> Số lượt truy cập duy nhất trong ngày
 */
export const getTodayUniqueVisits = async (pageName: string): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const { count, error } = await supabase
      .from('visit_logs')
      .select('id', { count: 'exact', head: true })
      .eq('page_name', pageName)
      .eq('visit_date', today);
    
    if (error) {
      console.error('Error getting today unique visits:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error in getTodayUniqueVisits:', error);
    return 0;
  }
};

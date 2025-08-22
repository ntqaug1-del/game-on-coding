import { supabase } from '@/integrations/supabase/client';

/**
 * Increments the visit counter for a specific page
 * @param pageName The name of the page to increment the counter for
 * @returns The updated count or null if there was an error
 */
export const incrementVisitCounter = async (pageName: string): Promise<number | null> => {
  try {
    // First, get the current count
    const { data: currentData, error: fetchError } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('page_name', pageName)
      .single();

    if (fetchError) {
      console.error('Error fetching visit counter:', fetchError);
      return null;
    }

    const currentCount = currentData?.count || 0;
    const newCount = currentCount + 1;

    // Update the counter
    const { error: updateError } = await supabase
      .from('visit_counter')
      .update({ 
        count: newCount,
        last_updated: new Date().toISOString()
      })
      .eq('page_name', pageName);

    if (updateError) {
      console.error('Error updating visit counter:', updateError);
      return null;
    }

    return newCount;
  } catch (error) {
    console.error('Error in incrementVisitCounter:', error);
    return null;
  }
};

/**
 * Gets the current visit count for a specific page
 * @param pageName The name of the page to get the counter for
 * @returns The current count or null if there was an error
 */
export const getVisitCount = async (pageName: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('visit_counter')
      .select('count')
      .eq('page_name', pageName)
      .single();

    if (error) {
      console.error('Error fetching visit counter:', error);
      return null;
    }

    return data?.count || 0;
  } catch (error) {
    console.error('Error in getVisitCount:', error);
    return null;
  }
};

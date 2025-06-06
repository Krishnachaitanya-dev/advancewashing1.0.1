
import { supabase } from './client';

export async function applyRLSPolicies() {
  try {
    console.log('Applying RLS policies...');
    
    // Read the SQL file content
    const response = await fetch('/src/integrations/supabase/rls-policies.sql');
    const sqlContent = await response.text();
    
    // Split the SQL into individual statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Execute each SQL statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.error('Error applying RLS policy:', error);
        console.error('Statement:', statement);
      }
    }
    
    console.log('RLS policies applied successfully');
    return true;
  } catch (error) {
    console.error('Error applying RLS policies:', error);
    return false;
  }
}

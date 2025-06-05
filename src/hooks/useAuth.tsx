import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: { name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Temporary admin emails list - remove this once database policies are fixed
const ADMIN_EMAILS = ['admin@gmail.com'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider - Setting up auth state listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider - Initial session:', session, 'Error:', error);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider - Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkUserRole(session.user);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    // Temporary fallback for admin detection using email
    // This should be removed once database policies are fixed
    if (ADMIN_EMAILS.includes(user.email || '')) {
      console.log('Admin detected via email fallback:', user.email);
      setIsAdmin(true);
      return;
    }

    try {
      console.log('Checking user role for:', user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('User role check result:', profile, error);
      
      // Handle the infinite recursion error gracefully
      if (error && error.code === '42P17') {
        console.warn('Database policy issue detected, using email fallback for admin detection');
        // Use email-based fallback when database policies fail
        setIsAdmin(ADMIN_EMAILS.includes(user.email || ''));
        return;
      }
      
      if (error) {
        console.error('Error checking user role:', error);
        // Use email-based fallback on any database error
        setIsAdmin(ADMIN_EMAILS.includes(user.email || ''));
        return;
      }

      setIsAdmin(profile?.role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
      // Use email-based fallback on any exception
      setIsAdmin(ADMIN_EMAILS.includes(user.email || ''));
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string; phone?: string }) => {
    try {
      console.log('Attempting sign up for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone
          }
        }
      });

      console.log('Sign up result:', data, error);

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Success",
        description: "Please check your email to verify your account"
      });
      return { success: true };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in result:', data, error);

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in"
      });
      return { success: true };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

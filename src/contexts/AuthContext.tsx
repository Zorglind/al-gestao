import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: 'admin' | 'professional';
  avatar_url?: string;
  phone?: string;
  specialty?: string;
  work_start_time?: string;
  work_end_time?: string;
  permissions?: {
    dashboard: boolean;
    clients: boolean;
    agenda: boolean;
    services: boolean;
    products: boolean;
    financial: boolean;
    anamnesis: boolean;
    professionals: boolean;
    exports: boolean;
    profile: boolean;
  };
  created_by_admin?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isProfessional: boolean;
  getUserTypeDisplay: () => string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      const profile: UserProfile = {
        id: data.id,
        user_id: data.user_id,
        name: data.name,
        role: data.role,
        avatar_url: data.avatar_url,
        phone: data.phone,
        specialty: data.specialty,
        work_start_time: data.work_start_time,
        work_end_time: data.work_end_time,
        permissions: typeof data.permissions === 'object' && data.permissions !== null 
          ? data.permissions as any
          : {
              dashboard: true,
              clients: true,
              agenda: true,
              services: data.role === 'admin',
              products: data.role === 'admin',
              financial: data.role === 'admin',
              anamnesis: true,
              professionals: data.role === 'admin',
              exports: data.role === 'admin',
              profile: true
            },
        created_by_admin: data.created_by_admin,
        is_active: data.is_active
      };

      return profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        setLoading(false);
        return { error };
      }

      return {};
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      setLoading(false);

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      return { error };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile || !profile.is_active) return false;
    
    if (profile.role === 'admin') return true;
    
    if (profile.role === 'professional' && profile.permissions) {
      return profile.permissions[permission as keyof typeof profile.permissions] || false;
    }
    
    return false;
  };

  const isAdmin = profile?.role === 'admin' && profile?.is_active;
  const isProfessional = profile?.role === 'professional' && profile?.is_active;
  
  const getUserTypeDisplay = (): string => {
    if (!profile) return '';
    
    if (profile.role === 'admin') {
      return profile.created_by_admin ? 'Administrador (Criado por Admin)' : 'Administrador';
    }
    
    if (profile.role === 'professional') {
      return 'Profissional com Permissões Limitadas';
    }
    
    return 'Usuário';
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      login,
      signUp,
      logout,
      isAuthenticated: !!user && !!profile && profile.is_active,
      hasPermission,
      isAdmin,
      isProfessional,
      getUserTypeDisplay,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
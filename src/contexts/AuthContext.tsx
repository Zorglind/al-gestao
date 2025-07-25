import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professional';
  permissions: string[];
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@sollima.com',
    role: 'admin',
    permissions: ['dashboard', 'profissionais', 'clientes', 'agenda', 'anamnese', 'produtos', 'servicos', 'catalogo', 'financeiro', 'exportacoes', 'perfil'],
    isActive: true
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'profissional@sollima.com',
    role: 'professional',
    permissions: ['dashboard', 'clientes', 'agenda', 'anamnese', 'catalogo'],
    isActive: true
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'teste@sollima.com',
    role: 'professional',
    permissions: ['dashboard', 'clientes', 'agenda'],
    isActive: true
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verifica se há um usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    console.log('AuthContext: Checking saved user:', savedUser);
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      console.log('AuthContext: Setting user from localStorage:', userData);
      setUser(userData);
    }
  }, []);

  const login = async (emailOrCpf: string, password: string): Promise<boolean> => {
    console.log('AuthContext: Login attempt for:', emailOrCpf);
    // Find user by email or test with predefined passwords
    const foundUser = mockUsers.find(u => 
      u.email === emailOrCpf && u.isActive
    );
    
    console.log('AuthContext: Found user:', foundUser);
    
    if (foundUser && password === "123456") {
      console.log('AuthContext: Login successful, setting user');
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    
    console.log('AuthContext: Login failed');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    const hasAccess = user?.permissions.includes(permission) || false;
    console.log(`AuthContext: Permission check for ${permission}:`, hasAccess, 'User:', user?.name);
    return hasAccess;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission
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
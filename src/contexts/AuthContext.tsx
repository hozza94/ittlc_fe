// frontend/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/api/auth';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginApi({ username: email, password });
      localStorage.setItem('auth_token', data.access_token);
      const userData = await getCurrentUser();
      setUser(userData);
      router.push('/main');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      localStorage.removeItem('auth_token');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// // src/contexts/AuthContext.tsx
// 'use client';

// import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// type User = {
//   id: string;
//   username: string;
//   email: string;
// };

// type AuthContextType = {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Check authentication status on initial load
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         // Check for token in cookies
//         const token = document.cookie
//           .split('; ')
//           .find(row => row.startsWith('auth-token='))
//           ?.split('=')[1];

//         if (token) {
//           // TODO: Verify token with backend
//           // For now, we'll just set a mock user
//           setUser({ id: '1', username: 'Admin', email: 'admin@example.com' });
//         }
//       } catch (error) {
//         console.error('Auth check failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       // TODO: Replace with actual API call
//       if (email === 'admin@example.com' && password === 'password') {
//         const userData = { id: '1', username: 'Admin', email };
//         setUser(userData);
//         // Set token in cookie that expires in 1 day
//         document.cookie = `auth-token=dummy-token; path=/; max-age=${60 * 60 * 24}`;
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Login failed:', error);
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     // Remove the auth token
//     document.cookie = 'auth-token=; path=/; max-age=0';
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         user, 
//         login, 
//         logout, 
//         isAuthenticated: !!user,
//         loading 
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

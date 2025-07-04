import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you would validate credentials against a backend
    // For demo purposes, we'll just simulate a successful login
    
    // Try to find the user in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find((u: User) => u.email === email);
    
    if (!foundUser) {
      throw new Error('User not found');
    }
    
    // In a real app, you would verify the password here
    
    setUser(foundUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(foundUser));
  };

  const register = async (email: string, password: string, username: string) => {
    // In a real app, you would create a new user in the backend
    // For demo purposes, we'll just simulate a successful registration
    const newUser = {
      id: Date.now().toString(),
      email,
      name: username,
    };
    
    // Store user in "database" (localStorage)
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
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
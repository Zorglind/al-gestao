import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NOTIFICATIONS } from '@/constants/branding';

interface NotificationContextType {
  notifications: string[];
  addNotification: (notification: string) => void;
  removeNotification: (index: number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<string[]>([...NOTIFICATIONS.defaultItems]);

  const addNotification = (notification: string) => {
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
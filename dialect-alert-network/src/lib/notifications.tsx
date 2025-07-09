'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';

interface AlertNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
  type: 'dialect' | 'system' | 'alert';
}

interface NotificationsContextType {
  notifications: AlertNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  loading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    // Subscribe to notifications for the current user
    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      where('timestamp', '>=', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // Last 30 days
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alerts: AlertNotification[] = [];
      snapshot.forEach((doc) => {
        alerts.push({
          id: doc.id,
          ...doc.data() as Omit<AlertNotification, 'id'>
        });
      });

      // Sort by timestamp descending (newest first)
      alerts.sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());
      setNotifications(alerts);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const notificationRef = doc(db, 'users', user.uid, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    loading
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
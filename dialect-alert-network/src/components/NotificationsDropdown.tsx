'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, loading } = useNotifications();

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="notifications-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <span className="sr-only">Open notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notifications-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <a
                    key={notification.id}
                    href="#"
                    className={cn(
                      "block px-4 py-3 text-sm",
                      !notification.read && "bg-blue-50"
                    )}
                    role="menuitem"
                    tabIndex="-1"
                    onClick={(e) => {
                      e.preventDefault();
                      markAsRead(notification.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDistanceToNow(notification.timestamp.toDate(), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
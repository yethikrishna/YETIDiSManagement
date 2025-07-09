import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for conditional class names with Tailwind
 export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utility
 export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
}

// Time ago formatting utility
 export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(diffInSeconds / 31536000);
  if (interval >= 1) return `${interval}y ago`;

  interval = Math.floor(diffInSeconds / 2592000);
  if (interval >= 1) return `${interval}mo ago`;

  interval = Math.floor(diffInSeconds / 86400);
  if (interval >= 1) return `${interval}d ago`;

  interval = Math.floor(diffInSeconds / 3600);
  if (interval >= 1) return `${interval}h ago`;

  interval = Math.floor(diffInSeconds / 60);
  if (interval >= 1) return `${interval}m ago`;

  return 'just now';
}
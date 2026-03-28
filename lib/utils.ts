import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

export function getInitials(username: string): string {
  const parts = username.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export function linkifyUrls(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    // Clean trailing punctuation
    const cleanUrl = url.replace(/[.,;!?]$/, '');
    const punctuation = url !== cleanUrl ? url.slice(cleanUrl.length) : '';
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">${cleanUrl}</a>${punctuation}`;
  });
}

export function generateGuestUsername(): string {
  return `Guest#${Math.floor(1000 + Math.random() * 9000)}`;
}

export function getRandomAvatarColor(): string {
  const colors = [
    '#7c3aed', // purple
    '#ec4899', // pink
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#8b5cf6', // violet
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

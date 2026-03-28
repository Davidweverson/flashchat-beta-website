'use client';

import { cn, getInitials } from '@/lib/utils';

interface UserAvatarProps {
  username: string;
  avatarColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showInitials?: boolean;
}

export function UserAvatar({
  username,
  avatarColor = '#7c3aed',
  size = 'md',
  className,
  showInitials = true,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: avatarColor }}
    >
      {showInitials ? getInitials(username) : null}
    </div>
  );
}

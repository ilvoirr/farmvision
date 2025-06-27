'use client';
import { useUser, UserButton } from "@clerk/nextjs";
import { useRef } from 'react';

export default function UserDisplay() {
  const { user } = useUser();
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  return (
    
      <div
        className="flex w-[110px] items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white font-bold text-lg cursor-pointer hover:bg-gray-700"
        onClick={() => {
          // Forward click to the actual UserButton
          const btn = triggerRef.current?.querySelector('button');
          btn?.click();
        }}
      >
        <span>{user.username}</span>
        <div ref={triggerRef}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    
  );
}

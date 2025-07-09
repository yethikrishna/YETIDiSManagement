'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Button } from './ui/Button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-blue-600">DialectAlert</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>              
              <NotificationsDropdown />
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/recognition"
                  className="text-sm font-medium transition-colors hover:text-blue-600"
                >
                  Recognition
                </Link>
              </nav>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
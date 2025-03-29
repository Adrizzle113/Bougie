// src/components/navigation/user/UserTopNav.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Bell, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import styles from './UserNavigation.module.css';

interface UserTopNavProps {
  onMenuClick: () => void;
  userName: string;
  onSignOut: () => void;
}

export function UserTopNav({ onMenuClick, userName, onSignOut }: UserTopNavProps) {
  return (
    <div className={styles.topNav}>
      <div className={styles.navContent}>
        <div className={styles.logoSection}>
          <button 
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/user" className={styles.logo}>
              User Dashboard
            </Link>
            <div className={styles.name}>
              Welcome, {userName}
            </div>
          </div>
        </div>
        
        <div className={styles.utilityNav}>
          <button 
            className={styles.utilityButton}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="text-[#e7decf] hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
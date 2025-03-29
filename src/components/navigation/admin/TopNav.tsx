// src/components/navigation/admin/TopNav.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Mail, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import styles from './Sidebar.module.css';

interface TopNavProps {
  onMenuClick: () => void;
  userName: string;
  onSignOut: () => void;
}

export function TopNav({ onMenuClick, userName, onSignOut }: TopNavProps) {
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
            <Link href="/dashboard/admin" className={styles.logo}>
              TripAdmin
            </Link>
            <div className={styles.name}>
              Welcome, {userName}
            </div>
          </div>
        </div>
        
        <div className={styles.utilityNav}>
          {/* Utility buttons */}
          <button 
            className={styles.utilityButton}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          
          <button 
            className={styles.utilityButton}
            aria-label="Messages"
          >
            <Mail className="w-5 h-5" />
          </button>
          
          <button 
            className={styles.utilityButton}
            aria-label="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Logout button */}
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
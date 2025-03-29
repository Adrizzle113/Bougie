// src/components/navigation/admin/Sidebar.tsx
'use client';

import { Calendar, Home, Map, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
  { name: 'Trips', href: '/dashboard/admin/trips', icon: Map },
  { name: 'Add Trip', href: '/dashboard/admin/trips/new', icon: Plus }, // Updated path
  { name: 'Calendar', href: '/dashboard/admin/calendar', icon: Calendar },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div 
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.navSection}>
          <div className={styles.sectionNav}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${styles.sidebarLink} ${
                    isActive ? styles.sidebarLinkActive : ''
                  }`}
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      onClose();
                    }
                  }}
                >
                  <item.icon className={styles.sidebarIcon} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
    </>
  );
}
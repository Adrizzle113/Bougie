// src/components/navigation/user/UserSidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, User, Map, Calendar, CreditCard, FileText } from 'lucide-react';
import styles from './UserNavigation.module.css';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/user', icon: Home },
    { name: 'My Profile', href: '/dashboard/user/profile', icon: User },
    { name: 'My Trips', href: '/dashboard/user/trips', icon: Map },
    { name: 'Calendar', href: '/dashboard/user/calendar', icon: Calendar },
    { name: 'Payments', href: '/dashboard/user/payments', icon: CreditCard },
    { name: 'Forms', href: '/dashboard/user/forms', icon: FileText },
  ];

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.navSection}>
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
  );
}
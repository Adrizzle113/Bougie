// src/components/navigation/user/UserSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  HelpCircle,
  Package,
} from 'lucide-react';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: 'Dashboard', href: ROUTES.USER.DASHBOARD },
  { icon: BookOpen
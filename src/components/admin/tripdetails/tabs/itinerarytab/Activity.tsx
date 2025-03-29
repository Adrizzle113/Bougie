// src/components/admin/tripdetails/tabs/itinerarytab/Activity.tsx
'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripHorizontal, Clock, Timer, Trash2, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from './timeline.module.css';

const ACTIVITY_TYPES: Record<string, string> = {
  'Sightseeing': 'Sightseeing',
  'Location': 'Location Visit',
  'Accommodation': 'Accommodation',
  'Cruise': 'Cruise',
  'Train': 'Train Journey',
  'Bus': 'Bus Transfer',
  'Check-in/out': 'Check-in/out',
  'Arrival': 'Arrival',
  'Departure': 'Departure',
  'Flight': 'Flight',
  'Transfer': 'Transfer',
};

type ActivityType = keyof typeof ACTIVITY_TYPES;

interface ActivityProps {
  id: string;
  type: ActivityType;
  description: string;
  time?: string;
  duration?: string;
  isHighlight?: boolean;
  onUpdate: (updates: { 
    type?: ActivityType; 
    description?: string; 
    time?: string; 
    duration?: string;
    isHighlight?: boolean;
  }) => void;
  onDelete: () => void;
}

export default function Activity({
  id,
  type,
  description,
  time,
  duration,
  isHighlight = false,
  onUpdate,
  onDelete
}: ActivityProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.activityContainer} ${isHighlight ? styles.highlighted : ''}`}
    >
      <div className={styles.activityHeader}>
        <button {...attributes} {...listeners} className={styles.dragHandle}>
          <GripHorizontal className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <div className="min-w-[200px] bg-white">
            <Select
              value={type}
              onValueChange={(value: ActivityType) => {
                onUpdate({ type: value });
              }}
            >
              <SelectTrigger className="w-full bg-white border border-input hover:bg-accent hover:text-accent-foreground">
                <SelectValue>
                  {ACTIVITY_TYPES[type]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.entries(ACTIVITY_TYPES).map(([key, value]) => (
                  <SelectItem 
                    key={key} 
                    value={key}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onUpdate({ isHighlight: !isHighlight })}
          className={`${styles.starButton} ${isHighlight ? styles.starButtonActive : ''}`}
        >
          <Star className="h-5 w-5" />
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className={styles.deleteButton}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className={styles.activityContent}>
        <div className={styles.timeInputsContainer}>
          <div className={styles.timeInputWrapper}>
            <Clock className={styles.timeIcon} />
            <Input
              type="time"
              value={time || ''}
              onChange={(e) => onUpdate({ time: e.target.value })}
              className={styles.timeInput}
            />
          </div>

          <div className={styles.timeInputWrapper}>
            <Timer className={styles.timeIcon} />
            <Input
              value={duration || ''}
              onChange={(e) => onUpdate({ duration: e.target.value })}
              placeholder="Duration"
              className={styles.timeInput}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <textarea
            value={description}
            onChange={(e) => onUpdate({ 
              description: e.target.value,
              time,
              duration,
              isHighlight
            })}
            placeholder="Enter activity description"
            className={styles.description}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
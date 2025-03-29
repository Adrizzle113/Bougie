//components/bookingflow/RoomSelector.tsx
'use client';

import React from 'react';
import { Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { RoomRate } from '@/types/pricing';

interface RoomTypeConfig {
  name: string;
  maxOccupancy: number;
  recommended?: boolean;
}

export const ROOM_TYPE_CONFIG: Record<string, RoomTypeConfig> = {
  single: {
    name: 'Single Room',
    maxOccupancy: 1
  },
  double: {
    name: 'Double Room',
    maxOccupancy: 2,
    recommended: true
  },
  triple: {
    name: 'Triple Room',
    maxOccupancy: 3
  },
  quad: {
    name: 'Quad Room',
    maxOccupancy: 4
  }
};

export interface RoomSelectorProps {
  passengers: number;
  selectedRoomType: string;
  onRoomSelect: (roomType: string) => void;
  roomRates: RoomRate[];
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ 
  passengers,
  selectedRoomType,
  onRoomSelect,
  roomRates
}) => {
  const isRoomTypeValid = (maxOccupancy: number): boolean => {
    return maxOccupancy >= passengers;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Room Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roomRates.map((room) => {
          const config = ROOM_TYPE_CONFIG[room.type];
          if (!config) return null;

          const isValid = isRoomTypeValid(config.maxOccupancy);
          
          return (
            <div
              key={room.id}
              className={`relative p-4 border rounded-lg transition-colors ${
                !isValid
                  ? 'opacity-50 cursor-not-allowed'
                  : selectedRoomType === room.type
                  ? 'border-[#17403a] bg-[#17403a]/5 cursor-pointer'
                  : 'border-gray-200 hover:border-[#17403a]/50 cursor-pointer'
              }`}
              onClick={() => {
                if (isValid) {
                  onRoomSelect(room.type);
                }
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {config.name}
                    {config.recommended && (
                      <span className="inline-block px-2 py-1 text-xs bg-[#17403a] text-white rounded">
                        Recommended
                      </span>
                    )}
                    {!isValid && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} className="text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This room type cannot accommodate {passengers} passengers</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {room.description || config.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${room.price.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">per person</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RoomSelector;
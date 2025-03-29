// components/bookingflow/BookingTopBar.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface BookingTopBarProps {
  currentStep: number;
}

export function BookingTopBar({ currentStep = 1 }: BookingTopBarProps) {
  const router = useRouter();
  
  const steps = [
    { label: 'Trip Overview', path: './book' },
    { label: 'Passenger Details', path: './passenger-details' },
    { label: 'Payment', path: './payment' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.label}>
                <button
                  onClick={() => handleNavigation(step.path)}
                  className={`font-medium ${
                    index + 1 === currentStep ? 'text-black' : 'text-gray-400'
                  } hover:text-black transition`}
                >
                  {`${index + 1}. ${step.label}`}
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-right">
            <span className="text-gray-600">FREEPHONE</span>
            <div className="font-bold">1-800-367-1835</div>
          </div>
        </div>
      </div>
    </div>
  );
}

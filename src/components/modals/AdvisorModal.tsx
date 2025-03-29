//components/modals/AdvisorModeal

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Copy } from 'lucide-react';

interface AdvisorContactProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADVISOR_INFO = {
  name: "Jane Smith",
  title: "Luxury Travel Advisor",
  email: "jane.smith@luxurytravel.com",
  phone: "+1 (555) 123-4567"
};

export default function AdvisorModal({ isOpen, onClose }: AdvisorContactProps) {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ADVISOR_INFO.email);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ADVISOR_INFO.phone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Your Advisor</DialogTitle>
          <DialogDescription>
            Get in touch with your luxury travel advisor
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{ADVISOR_INFO.name}</h3>
            <p className="text-sm text-gray-500">{ADVISOR_INFO.title}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm">{ADVISOR_INFO.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopyEmail}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-sm">{ADVISOR_INFO.phone}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCopyPhone}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
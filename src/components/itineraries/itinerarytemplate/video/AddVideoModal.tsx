// src/components/itinerarytemplate/modals/AddVideoModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  
  interface AddVideoModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (url: string) => void;
  }
  
  export function AddVideoModal({ open, onClose, onAdd }: AddVideoModalProps) {
    const [url, setUrl] = useState('');
  
    const handleSubmit = () => {
      if (url) {
        onAdd(url);
        setUrl('');
        onClose();
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Enter video URL (YouTube or Vimeo)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!url}>
                Add Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
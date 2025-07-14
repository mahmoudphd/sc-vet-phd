import React from 'react';
import { Button, Dialog } from '@radix-ui/themes';
import { toast } from 'sonner';

interface ExportCSVModelProps {
    isOpen: boolean;
    onClose: () => void;
}


const ExportCSVModel: React.FC<ExportCSVModelProps> = ({ isOpen, onClose }) => {
  const handleExport = () => {
    // Logic for exporting CSV
    toast.success('CSV exported successfully');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>Export CSV</Dialog.Title>
        <p>Are you sure you want to export the CSV file?</p>
          <Button variant="soft" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} variant="solid">Export</Button>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExportCSVModel;
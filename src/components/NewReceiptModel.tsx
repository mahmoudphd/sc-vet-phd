import React from 'react';
import { Button, TextField, Dialog, Flex } from '@radix-ui/themes';
import { toast } from 'sonner';


interface NewReceiptModelProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewReceiptModel: React.FC<NewReceiptModelProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Logic for creating a new receipt
    toast.success('New receipt created successfully');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>New Receipt</Dialog.Title>
        <form onSubmit={handleSubmit}>
          <TextField.Root  placeholder="Product Name" required />
          <TextField.Root className="mt-2"  placeholder="Batch Number" required />
          <TextField.Root className="mt-2" type="number" placeholder="Quantity" required />
          <Flex>
            <Button variant="soft" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="solid">Create</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NewReceiptModel;
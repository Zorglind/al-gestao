import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

export function SignatureModal({ open, onClose, onSave }: SignatureModalProps) {
  const sigRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigRef.current?.clear();
  };

  const handleSave = () => {
    if (sigRef.current?.isEmpty()) {
      alert('Por favor, faça sua assinatura antes de salvar.');
      return;
    }
    
    const signatureData = sigRef.current?.toDataURL();
    if (signatureData) {
      onSave(signatureData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assinatura Eletrônica</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-gray-300 rounded-lg">
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{
                width: 550,
                height: 200,
                className: 'signature-canvas rounded-lg'
              }}
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Use o mouse ou toque na tela para fazer sua assinatura
          </p>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              Limpar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar Assinatura
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
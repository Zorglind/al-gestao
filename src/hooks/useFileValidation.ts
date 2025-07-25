import { useState } from 'react';
import { validate } from '@/utils/inputValidation';
import { useToast } from '@/hooks/use-toast';

export const useFileValidation = () => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);

  const validateFile = async (
    file: File, 
    type: 'image' | 'excel' = 'image'
  ): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const validation = type === 'excel' 
        ? validate.excel(file) 
        : validate.file(file);
      
      if (!validation.isValid) {
        toast({
          title: "Arquivo inválido",
          description: validation.error,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Erro na validação",
        description: "Não foi possível validar o arquivo",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const validateMultipleFiles = async (
    files: FileList, 
    type: 'image' | 'excel' = 'image'
  ): Promise<File[]> => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isValid = await validateFile(file, type);
      if (isValid) {
        validFiles.push(file);
      }
    }
    
    return validFiles;
  };

  return {
    validateFile,
    validateMultipleFiles,
    isValidating
  };
};
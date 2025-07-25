// Centralized input validation and sanitization utilities

export const sanitize = {
  string: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  },
  
  email: (email: string): string => {
    return email.toLowerCase().trim();
  },
  
  phone: (phone: string): string => {
    return phone.replace(/[\s\-\(\)\.]/g, '');
  },

  filename: (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
};

export const validate = {
  email: (email: string): { isValid: boolean; error?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return { isValid: false, error: 'Email é obrigatório' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Formato de email inválido' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email muito longo' };
    }
    
    return { isValid: true };
  },

  cpf: (cpf: string): { isValid: boolean; error?: string } => {
    if (!cpf) return { isValid: true }; // CPF é opcional
    
    // Remove non-numeric characters
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    
    if (cleanCpf.length !== 11) {
      return { isValid: false, error: 'CPF deve ter 11 dígitos' };
    }
    
    // Check for obviously invalid CPFs (all same digits)
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return { isValid: false, error: 'CPF inválido' };
    }
    
    // Validate CPF check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cleanCpf.charAt(9))) {
      return { isValid: false, error: 'CPF inválido' };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cleanCpf.charAt(10))) {
      return { isValid: false, error: 'CPF inválido' };
    }
    
    return { isValid: true };
  },

  phone: (phone: string): { isValid: boolean; error?: string } => {
    if (!phone) return { isValid: true }; // Phone é opcional
    
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{8,14}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Formato de telefone inválido' };
    }
    
    return { isValid: true };
  },

  name: (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
      return { isValid: false, error: 'Nome é obrigatório' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }
    
    if (name.length > 100) {
      return { isValid: false, error: 'Nome muito longo' };
    }
    
    if (/[<>]/.test(name)) {
      return { isValid: false, error: 'Nome contém caracteres inválidos' };
    }
    
    return { isValid: true };
  },

  file: (file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']
    } = options;

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `Arquivo deve ter menos de ${Math.round(maxSize / 1024 / 1024)}MB` 
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: `Tipo de arquivo não permitido. Use: ${allowedTypes.join(', ')}` 
      };
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      return { 
        isValid: false, 
        error: `Extensão não permitida. Use: ${allowedExtensions.join(', ')}` 
      };
    }

    return { isValid: true };
  },

  excel: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    
    return validate.file(file, {
      maxSize: 10 * 1024 * 1024, // 10MB for Excel files
      allowedTypes,
      allowedExtensions
    });
  }
};

export const formatters = {
  cpf: (cpf: string): string => {
    const cleaned = cpf.replace(/[^\d]/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  phone: (phone: string): string => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
};
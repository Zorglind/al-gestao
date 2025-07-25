export interface AnamneseField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'decimal' | 'select' | 'multiselect' | 'boolean' | 'agree' | 'trueFalse' | 'nps' | 'signature' | 'signatureImage';
  label: string;
  instructions?: string;
  required: boolean;
  options?: string[]; // For select/multiselect
  order: number;
}

export interface AnamneseTemplate {
  id: string;
  name: string;
  description?: string;
  fields: AnamneseField[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AnamneseResponse {
  id: string;
  templateId: string;
  templateName: string;
  clientId: string;
  clientName: string;
  professionalId: string;
  professionalName: string;
  serviceId?: string;
  serviceName?: string;
  responses: Record<string, any>; // field.id -> response value
  completedAt: Date;
  createdAt: Date;
}

export interface FieldValue {
  fieldId: string;
  value: any;
}
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { AnamneseField, AnamneseTemplate } from "@/types/anamnese";
import { SortableField } from "./SortableField";
import { FieldPreview } from "./FieldPreview";

interface FormBuilderProps {
  template?: AnamneseTemplate;
  onSave: (template: AnamneseTemplate) => void;
  onCancel: () => void;
}

const fieldTypes = [
  { value: 'text', label: 'Texto Curto' },
  { value: 'textarea', label: 'Texto Longo' },
  { value: 'number', label: 'Número Inteiro' },
  { value: 'decimal', label: 'Número Decimal' },
  { value: 'select', label: 'Seleção Única' },
  { value: 'multiselect', label: 'Seleção Múltipla' },
  { value: 'boolean', label: 'Sim / Não' },
  { value: 'agree', label: 'Concordo / Não Concordo' },
  { value: 'trueFalse', label: 'Verdadeiro / Falso' },
  { value: 'nps', label: 'NPS (1 a 5)' },
  { value: 'signature', label: 'Assinatura Eletrônica' },
  { value: 'signatureImage', label: 'Upload de Assinatura' }
];

export function FormBuilder({ template, onSave, onCancel }: FormBuilderProps) {
  const [templateName, setTemplateName] = useState(template?.name || '');
  const [templateDescription, setTemplateDescription] = useState(template?.description || '');
  const [fields, setFields] = useState<AnamneseField[]>(template?.fields || []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = () => {
    const newField: AnamneseField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
      order: fields.length
    };
    setFields([...fields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<AnamneseField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Nome do template é obrigatório');
      return;
    }

    const templateToSave: AnamneseTemplate = {
      id: template?.id || `template_${Date.now()}`,
      name: templateName,
      description: templateDescription,
      fields: fields.map((field, index) => ({ ...field, order: index })),
      createdAt: template?.createdAt || new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    onSave(templateToSave);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Formulário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Nome do Formulário *</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Anamnese Capilar Completa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateDescription">Descrição</Label>
              <Textarea
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Descreva o objetivo deste formulário"
                rows={3}
              />
            </div>
            <Button onClick={addField} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Campo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview do Formulário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {fields.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Adicione campos para ver o preview
              </p>
            ) : (
              fields.map((field) => (
                <FieldPreview key={field.id} field={field} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campos do Formulário</CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    fieldTypes={fieldTypes}
                    onUpdate={updateField}
                    onRemove={removeField}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar Formulário
        </Button>
      </div>
    </div>
  );
}
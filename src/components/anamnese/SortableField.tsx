import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { AnamneseField } from "@/types/anamnese";

interface SortableFieldProps {
  field: AnamneseField;
  fieldTypes: { value: string; label: string }[];
  onUpdate: (fieldId: string, updates: Partial<AnamneseField>) => void;
  onRemove: (fieldId: string) => void;
}

export function SortableField({ field, fieldTypes, onUpdate, onRemove }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const needsOptions = ['select', 'multiselect'].includes(field.type);

  const addOption = () => {
    const currentOptions = field.options || [];
    onUpdate(field.id, { options: [...currentOptions, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = field.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    onUpdate(field.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    const currentOptions = field.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    onUpdate(field.id, { options: newOptions });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing mt-2"
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo do Campo</Label>
                  <Select 
                    value={field.type} 
                    onValueChange={(value) => onUpdate(field.id, { type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Nome do Campo *</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                    placeholder="Ex: Nome completo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instruções (Opcional)</Label>
                <Textarea
                  value={field.instructions || ''}
                  onChange={(e) => onUpdate(field.id, { instructions: e.target.value })}
                  placeholder="Instruções para preenchimento do campo"
                  rows={2}
                />
              </div>

              {needsOptions && (
                <div className="space-y-2">
                  <Label>Opções de Seleção</Label>
                  <div className="space-y-2">
                    {(field.options || []).map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addOption} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Opção
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`required-${field.id}`}
                  checked={field.required}
                  onCheckedChange={(checked) => onUpdate(field.id, { required: checked as boolean })}
                />
                <Label htmlFor={`required-${field.id}`}>Campo obrigatório</Label>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(field.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { AnamneseField } from "@/types/anamnese";

interface FieldPreviewProps {
  field: AnamneseField;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

export function FieldPreview({ field, value, onChange, disabled = false }: FieldPreviewProps) {
  const handleChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder={field.instructions}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder={field.instructions}
            rows={3}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(parseInt(e.target.value) || '')}
            disabled={disabled}
            placeholder={field.instructions}
          />
        );

      case 'decimal':
        return (
          <Input
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => handleChange(parseFloat(e.target.value) || '')}
            disabled={disabled}
            placeholder={field.instructions}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleChange([...currentValues, option]);
                    } else {
                      handleChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={disabled}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <RadioGroup value={value || ''} onValueChange={handleChange} disabled={disabled}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${field.id}-sim`} />
              <Label htmlFor={`${field.id}-sim`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${field.id}-nao`} />
              <Label htmlFor={`${field.id}-nao`}>Não</Label>
            </div>
          </RadioGroup>
        );

      case 'agree':
        return (
          <RadioGroup value={value || ''} onValueChange={handleChange} disabled={disabled}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concordo" id={`${field.id}-concordo`} />
              <Label htmlFor={`${field.id}-concordo`}>Concordo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao-concordo" id={`${field.id}-nao-concordo`} />
              <Label htmlFor={`${field.id}-nao-concordo`}>Não Concordo</Label>
            </div>
          </RadioGroup>
        );

      case 'trueFalse':
        return (
          <RadioGroup value={value || ''} onValueChange={handleChange} disabled={disabled}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="verdadeiro" id={`${field.id}-verdadeiro`} />
              <Label htmlFor={`${field.id}-verdadeiro`}>Verdadeiro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="falso" id={`${field.id}-falso`} />
              <Label htmlFor={`${field.id}-falso`}>Falso</Label>
            </div>
          </RadioGroup>
        );

      case 'nps':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={value === rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange(rating)}
                disabled={disabled}
                className="flex items-center gap-1"
              >
                <Star className="h-4 w-4" />
                {rating}
              </Button>
            ))}
          </div>
        );

      case 'signature':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {disabled ? 'Assinatura capturada' : 'Clique para assinar eletronicamente'}
            </p>
          </div>
        );

      case 'signatureImage':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {disabled ? 'Imagem da assinatura enviada' : 'Clique para enviar imagem da assinatura'}
            </p>
          </div>
        );

      default:
        return <div>Tipo de campo não suportado</div>;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-destructive">*</span>}
      </Label>
      {field.instructions && (
        <p className="text-sm text-muted-foreground">{field.instructions}</p>
      )}
      {renderField()}
    </div>
  );
}
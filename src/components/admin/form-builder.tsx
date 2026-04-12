"use client";

import { useState } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Plus, Trash2, Settings2, Type, Mail, Phone, Hash,
  ListChecks, Calendar, FileText, ChevronDown, ChevronUp, ToggleLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  type: "text" | "email" | "phone" | "number" | "select" | "checkbox" | "textarea" | "date" | "file" | "section_divider";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: { min?: number; max?: number; pattern?: string };
}

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FIELD_TYPES = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "number", label: "Number", icon: Hash },
  { type: "select", label: "Dropdown", icon: ListChecks },
  { type: "checkbox", label: "Checkbox", icon: ToggleLeft },
  { type: "textarea", label: "Text Area", icon: FileText },
  { type: "date", label: "Date", icon: Calendar },
  { type: "section_divider", label: "Divider", icon: GripVertical },
] as const;

function SortableField({
  field,
  onUpdate,
  onRemove,
}: {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : undefined };
  const FieldIcon = FIELD_TYPES.find((ft) => ft.type === field.type)?.icon || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-background-card transition-all",
        isDragging ? "border-gold-500 shadow-lg" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <div {...attributes} {...listeners} className="cursor-grab text-foreground-subtle hover:text-foreground-muted">
          <GripVertical className="h-4 w-4" />
        </div>
        <FieldIcon className="h-4 w-4 text-foreground-muted shrink-0" />
        <input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ ...field, label: e.target.value })}
          className="flex-1 bg-transparent text-sm font-medium text-foreground focus:outline-none"
          placeholder="Field label..."
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onUpdate({ ...field, required: !field.required })}
            className={cn("text-xs px-1.5 py-0.5 rounded", field.required ? "bg-red-500/10 text-red-400" : "text-foreground-subtle hover:text-foreground-muted")}
          >
            {field.required ? "Required" : "Optional"}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-foreground-muted hover:text-foreground">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button onClick={onRemove} className="p-1 text-red-400 hover:text-red-300">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border space-y-2">
          <Input
            label="Placeholder"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ ...field, placeholder: e.target.value })}
          />
          {field.type === "select" && (
            <div>
              <label className="text-xs font-medium text-foreground-muted">Options (one per line)</label>
              <textarea
                value={(field.options || []).join("\n")}
                onChange={(e) => onUpdate({ ...field, options: e.target.value.split("\n").filter(Boolean) })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground min-h-[80px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const [showPalette, setShowPalette] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = fields.findIndex((f) => f.id === active.id);
    const newIdx = fields.findIndex((f) => f.id === over.id);
    onChange(arrayMove(fields, oldIdx, newIdx));
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: type as FormField["type"],
      label: FIELD_TYPES.find((ft) => ft.type === type)?.label || "New Field",
      required: false,
    };
    if (type === "select") newField.options = ["Option 1", "Option 2"];
    onChange([...fields, newField]);
    setShowPalette(false);
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                onUpdate={(updated) => onChange(fields.map((f) => (f.id === updated.id ? updated : f)))}
                onRemove={() => onChange(fields.filter((f) => f.id !== field.id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="text-center py-10 rounded-lg border border-dashed border-border">
          <p className="text-sm text-foreground-muted mb-2">No form fields yet</p>
          <p className="text-xs text-foreground-subtle">Add fields below to build your form</p>
        </div>
      )}

      <Button variant="outline" className="w-full border-dashed" onClick={() => setShowPalette(!showPalette)}>
        <Plus className="h-4 w-4" /> Add Field
      </Button>

      {showPalette && (
        <div className="grid grid-cols-3 gap-2 p-4 rounded-lg border border-border bg-background-card">
          {FIELD_TYPES.map((ft) => (
            <button
              key={ft.type}
              onClick={() => addField(ft.type)}
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-gold-500/30 hover:bg-gold-500/5 transition-all"
            >
              <ft.icon className="h-4 w-4 text-foreground-muted" />
              <span className="text-sm text-foreground">{ft.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

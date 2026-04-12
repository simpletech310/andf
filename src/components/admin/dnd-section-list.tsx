"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentBlockEditor } from "@/components/admin/content-block-editor";

interface ContentBlock {
  id: string;
  page_key: string;
  section_key: string;
  block_type: string;
  content: Record<string, any>;
  display_order: number;
  is_published: boolean;
  is_visible: boolean;
  settings: Record<string, any>;
}

interface DndSectionListProps {
  blocks: ContentBlock[];
  onReorder: (blocks: ContentBlock[]) => void;
  onSave: (block: ContentBlock) => Promise<void>;
  onDelete: (blockId: string) => void;
}

function SortableBlock({
  block,
  onSave,
  onDelete,
}: {
  block: ContentBlock;
  onSave: (block: ContentBlock) => Promise<void>;
  onDelete: (blockId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ContentBlockEditor
        block={block}
        onSave={onSave}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

export function DndSectionList({ blocks, onReorder, onSave, onDelete }: DndSectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex);
    onReorder(reordered);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onSave={onSave}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

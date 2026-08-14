"use client";

import { useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useBoardStore } from "@/lib/store";
import { BOARD_COLUMNS, IssueStatus, JIssue } from "@/lib/models";
import BoardColumn from "./BoardColumn";
import IssueCard from "./IssueCard";

export default function Board() {
  const loadProject = useBoardStore((s) => s.loadProject);
  const issuesByStatus = useBoardStore((s) => s.issuesByStatus);
  const moveIssue = useBoardStore((s) => s.moveIssue);
  const loaded = useBoardStore((s) => s.loaded);
  const issues = useBoardStore((s) => s.issues);

  const [activeIssue, setActiveIssue] = useState<JIssue | null>(null);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Require a small drag distance so clicks aren't swallowed (edge case:
  // distinguishing a click-to-open from a drag).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragStart = (e: DragStartEvent) => {
    const found = issues.find((i) => i.id === e.active.id);
    setActiveIssue(found ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = e;
    if (!over) return; // dropped outside any column

    const activeId = String(active.id);
    // `over` can be a column (droppable) or another card (sortable item).
    const overId = String(over.id);

    // Determine the destination status.
    const overIsColumn = (BOARD_COLUMNS as string[]).includes(overId);
    const toStatus = overIsColumn
      ? (overId as IssueStatus)
      : (over.data.current?.status as IssueStatus | undefined) ??
        issues.find((i) => i.id === overId)?.status;

    if (!toStatus) return;

    // Compute the drop index within the destination column.
    const columnIssues = issuesByStatus(toStatus).filter((i) => i.id !== activeId);
    let toIndex = columnIssues.length;
    if (!overIsColumn) {
      const overIdx = columnIssues.findIndex((i) => i.id === overId);
      if (overIdx !== -1) toIndex = overIdx;
    }

    moveIssue(activeId, toStatus, toIndex);
  };

  if (!loaded) {
    return <div className="p-6 text-slate-500">Loading board…</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto p-4">
        {BOARD_COLUMNS.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            issues={issuesByStatus(status)}
          />
        ))}
      </div>

      {/* Floating preview of the card being dragged. */}
      <DragOverlay>
        {activeIssue ? <IssueCard issue={activeIssue} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

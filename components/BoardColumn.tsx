"use client";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { IssueStatus, IssueStatusDisplay, JIssue } from "@/lib/models";
import IssueCard from "./IssueCard";

/** Ported from board-dnd-list.component — a status column that accepts drops. */
export default function BoardColumn({
  status,
  issues,
}: {
  status: IssueStatus;
  issues: JIssue[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-64 flex-shrink-0 flex-col">
      <div className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-slate-500">
        {IssueStatusDisplay[status]} <span className="text-slate-400">({issues.length})</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded p-2 transition-colors ${
          isOver ? "bg-blue-50" : "bg-slate-100"
        }`}
        style={{ minHeight: 120 }}
      >
        <SortableContext
          items={issues.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
          {issues.length === 0 && (
            <p className="px-1 py-4 text-center text-xs text-slate-400">
              No issues
            </p>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

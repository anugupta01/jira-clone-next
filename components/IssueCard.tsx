"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { JIssue, IssueTypeColors, IssuePriorityColors } from "@/lib/models";
import { useBoardStore } from "@/lib/store";

/** Ported from issue-card.component — a draggable card on the board. */
export default function IssueCard({ issue }: { issue: JIssue }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: issue.id, data: { status: issue.status } });
  const users = useBoardStore((s) => s.users);

  const assignees = issue.userIds
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 cursor-grab rounded bg-white p-3 shadow-sm hover:shadow transition-shadow"
    >
      <p className="mb-2 text-sm text-slate-800">{issue.title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Type indicator */}
          <span
            className="inline-block h-3.5 w-3.5 rounded-sm"
            style={{ backgroundColor: IssueTypeColors[issue.type] }}
            title={issue.type}
          />
          {/* Priority indicator */}
          <span
            className="inline-block h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: IssuePriorityColors[issue.priority] }}
            title={issue.priority}
          />
        </div>
        {/* Assignee avatars */}
        <div className="flex -space-x-2">
          {assignees.map((u) => (
            <img
              key={u!.id}
              src={u!.avatarUrl}
              alt={u!.name}
              title={u!.name}
              className="h-6 w-6 rounded-full border border-white object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

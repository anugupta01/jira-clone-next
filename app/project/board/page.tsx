import Board from "@/components/Board";

export const metadata = { title: "Board — Jira Clone" };

export default function BoardPage() {
  return (
    <div>
      <div className="px-6 pt-4">
        <h1 className="text-xl font-semibold">Kanban board</h1>
      </div>
      <Board />
    </div>
  );
}

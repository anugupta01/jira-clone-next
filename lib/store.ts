"use client";

import { create } from "zustand";
import { JIssue, JProject, JUser, IssueStatus } from "./models";

interface BoardState {
  project: JProject | null;
  issues: JIssue[];
  users: JUser[];
  loaded: boolean;

  loadProject: () => Promise<void>;
  getUser: (id: string) => JUser | undefined;
  issuesByStatus: (status: IssueStatus) => JIssue[];
  /** Move an issue to a new status at a target index, renumbering positions. */
  moveIssue: (issueId: string, toStatus: IssueStatus, toIndex: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  project: null,
  issues: [],
  users: [],
  loaded: false,

  loadProject: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch("/data/project.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load project (${res.status})`);
      const project = (await res.json()) as JProject;
      set({
        project,
        issues: Array.isArray(project.issues) ? project.issues : [],
        users: Array.isArray(project.users) ? project.users : [],
        loaded: true,
      });
    } catch {
      // Edge case: seed missing/corrupt — render an empty board, not a crash.
      set({ project: null, issues: [], users: [], loaded: true });
    }
  },

  getUser: (id) => get().users.find((u) => u.id === id),

  issuesByStatus: (status) =>
    get()
      .issues.filter((i) => i.status === status)
      .sort((a, b) => a.listPosition - b.listPosition),

  moveIssue: (issueId, toStatus, toIndex) => {
    set((state) => {
      const moving = state.issues.find((i) => i.id === issueId);
      if (!moving) return state; // edge case: unknown id → no-op

      // Column the issue is going into, excluding the moving issue itself.
      const target = state.issues
        .filter((i) => i.status === toStatus && i.id !== issueId)
        .sort((a, b) => a.listPosition - b.listPosition);

      // Clamp the insert index into valid bounds.
      const idx = Math.max(0, Math.min(toIndex, target.length));
      const updatedMoving: JIssue = { ...moving, status: toStatus };
      target.splice(idx, 0, updatedMoving);

      // Renumber listPosition within the target column (1-based, like Akita).
      const repositioned = new Map<string, number>();
      target.forEach((i, n) => repositioned.set(i.id, n + 1));

      const issues = state.issues.map((i) => {
        if (i.id === issueId) {
          return { ...updatedMoving, listPosition: repositioned.get(i.id)! };
        }
        if (repositioned.has(i.id)) {
          return { ...i, listPosition: repositioned.get(i.id)! };
        }
        return i;
      });

      return { ...state, issues };
    });
  },
}));

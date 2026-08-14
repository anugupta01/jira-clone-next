export enum IssueType {
  STORY = "Story",
  TASK = "Task",
  BUG = "Bug",
}

export enum IssueStatus {
  BACKLOG = "Backlog",
  SELECTED = "Selected",
  IN_PROGRESS = "InProgress",
  DONE = "Done",
}

export const IssueStatusDisplay: Record<IssueStatus, string> = {
  [IssueStatus.BACKLOG]: "Backlog",
  [IssueStatus.SELECTED]: "Selected for Development",
  [IssueStatus.IN_PROGRESS]: "In progress",
  [IssueStatus.DONE]: "Done",
};

/** Column order on the board, left → right. */
export const BOARD_COLUMNS: IssueStatus[] = [
  IssueStatus.BACKLOG,
  IssueStatus.SELECTED,
  IssueStatus.IN_PROGRESS,
  IssueStatus.DONE,
];

export enum IssuePriority {
  LOWEST = "Lowest",
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  HIGHEST = "Highest",
}

export const IssuePriorityColors: Record<IssuePriority, string> = {
  [IssuePriority.HIGHEST]: "#CD1317",
  [IssuePriority.HIGH]: "#E9494A",
  [IssuePriority.MEDIUM]: "#E97F33",
  [IssuePriority.LOW]: "#2D8738",
  [IssuePriority.LOWEST]: "#57A55A",
};

export const IssueTypeColors: Record<IssueType, string> = {
  [IssueType.STORY]: "#65BA43",
  [IssueType.TASK]: "#4FADE6",
  [IssueType.BUG]: "#E44D42",
};

export interface JComment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  issueId: string;
  userId: string;
  user?: JUser;
}

export interface JIssue {
  id: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  listPosition: number;
  description: string;
  estimate: number;
  timeSpent: number;
  timeRemaining: number;
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  userIds: string[];
  comments: JComment[];
  projectId: string;
}

export interface JUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  issueIds: string[];
}

export enum ProjectCategory {
  SOFTWARE = "Software",
  MARKETING = "Marketing",
  BUSINESS = "Business",
}

export interface JProject {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ProjectCategory;
  createdAt: string;
  updateAt: string;
  issues: JIssue[];
  users: JUser[];
}

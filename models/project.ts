import { Task } from "./task";
import { User } from "./user";

export type Project = {
  title: string;
  createdBy: string;
  listUser: User[];
  listTask: Task[];
  deleted: boolean;
  deletedAt: string;
  timestamps: string;
};

import { User } from "./user";

export type Task = {
  title: string;
  status: string;
  content: string;
  listUser: User[];
  priority: string;
  timeStart: string;
  timeFinish: string;
  createdBy: string;
  weekDay: string;
  deleted: boolean;
  deletedAt: string;
  timestamps: string;
};

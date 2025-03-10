import { Task } from "./Task";

export class Project {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public name: string,
    public description: string | null,
    public readonly createdAt: Date,
    private tasks: Task[] = [],
  ) {}

  getIncompleteTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed_on);
  }
}

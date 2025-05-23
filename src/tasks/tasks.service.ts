import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getTasks(user: User): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    return query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!found) {
      throw new Error(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const found = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!found) {
      throw new Error(`Task with ID "${user.id}" not found`);
    }

    console.log(found);

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: found,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      id,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new Error(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}

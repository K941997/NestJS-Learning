import { TaskStatus } from '../taskStatus.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksSearchFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}

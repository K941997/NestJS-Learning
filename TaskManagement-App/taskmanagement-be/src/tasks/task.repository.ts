/* eslint-disable prettier/prettier */
import { TaskEntity } from './entity/task.entity'
import { EntityRepository, getRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {    
    //!SQL không cần lấy dữ liệu Database ở đây vì typeorm đã hỗ trợ ở Service
}

/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, ConflictException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// import { v4 as uuid } from 'uuid'; //tạo id ngẫu nhiên
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksSearchFilterDto } from './dto/getTasksSearchFilter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import { TaskStatus } from './taskStatus.enum';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { getRepository, ILike, Like, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { CategoryEntity } from 'src/categories/entity/category.entity';
import { ForbiddenError } from '@casl/ability';
import { Action } from 'src/casl/casl-action.enum';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { TaskToCategoryEntity } from './entity/taskToCategory.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Cache } from 'cache-manager';
import { GET_CACHE_KEY } from 'src/cacheManully/cacheKey.constant';
import { from, Observable } from 'rxjs';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { map } from 'rxjs/operators';
import { TaskInterface } from './entity/task.interface';

@Injectable()
export class TasksService {
  constructor (
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,

    private caslAbilityFactory: CaslAbilityFactory, //CASL Role

    // @Inject(CACHE_MANAGER) //!(Cache Manually) 
    // private cacheManager: Cache

  ) {}

  // //!Clear: (Cache Manually)
  // async clearCache() { //Clear Cache when Create Update Delete
  //   const keys: string[] = await this.cacheManager.store.keys();
  //   keys.forEach((key) => {
  //     if (key.startsWith(GET_CACHE_KEY)) {
  //       this.cacheManager.del(key);
  //     }
  //   })
  // }

 

 
  //!Create A Task + Relation Database (author + categories):
  async createTask(createTaskDto: CreateTaskDto, author: UserEntity): Promise<TaskEntity> {

    const { title, description, categoryIds } = createTaskDto; //todo: dto
    // const taskNew = new TaskEntity();
    // taskNew.title = title;
    // taskNew.description = description;
    // taskNew.status = TaskStatus.OPEN;
    // taskNew.author = author;
    // taskNew.taskToCategory = [] ; //todo: ManyToMany Advanced Relation Xem lai

    const task = this.taskRepository.create( //todo: Repo.create dto
      createTaskDto
    )

    task.author = author  //todo: Relation OneToMany
    task.taskToCategories = []; //Tạo Task chứa Categories rỗng: //todo: Relation ManyToMany

    const newTask = await task.save(); //todo: Repo.save


    //todo: Tạo Task có 2 categories giống nhau, trả về 1 category:
    const arr = [];
    for(let i = 0; i<categoryIds.length; i++){
      if(arr.indexOf(categoryIds[i]) === -1)
        arr.push(categoryIds[i])
    }
    console.log(arr)
    
    //todo: Tạo Task chứa Categories có giá trị:
    for (let i = 0; i < arr.length; i++) {
      const category = await getRepository(CategoryEntity).findOne(arr[i]);

      if (category) {
        const taskToCategory = new TaskToCategoryEntity();
        taskToCategory.taskId = newTask.id
        taskToCategory.categoryId = category.id

        task.taskToCategories.push(taskToCategory); 
      }
    }

    await task.save()
    // await this.clearCache(); //!Cache Manually
    return task;

  }

  // //!Get All Tasks + Get All Tasks Search Filter: (Dùng được)
  // async getTasksSearchFilter(filterDto: GetTasksSearchFilterDto): Promise<TaskEntity[]> {
  //   const { status, search } = filterDto;
  //   const query = this.taskRepository
  //     .createQueryBuilder('task') //!TypeOrm Query Builder
  //     .orderBy("task.id")
  //     .leftJoinAndSelect('task.taskToCategories', 'category');
      
  //   if (status) {
  //     query.andWhere('task.status = :status', { status });
  //   }
  //   if (search) {
  //     query.andWhere(
  //       '(task.title LIKE :search OR task.description LIKE :search)',
  //       { search: `%${search}%` },
  //     );
  //   }

  //   const tasks = await query.getMany();
  //   return tasks;
  // }


  // //!Pagination Infinite Scroll:
  // getTasksSelected(take: number = 10, skip: number = 0): Promise<TaskEntity[]> {
  //   return (
  //     this.taskRepository
  //       .createQueryBuilder('task')
  //       .innerJoinAndSelect('task.author', 'author')
  //       .orderBy('task.createdAt', 'DESC') //todo: Mới nhất đến cũ nhất
  //       .take(take)
  //       .skip(skip)
  //       .getMany()
  //   )
  // }

  //!Get All Tasks + Pagination: (Phân trang)
  paginate(options: IPaginationOptions): Observable<Pagination<TaskInterface>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.orderBy('task.createdAt', 'DESC'); //todo: Mới nhất đến cũ nhất

    return from (paginate<TaskInterface>(queryBuilder, options));
  }

  // paginate(options: IPaginationOptions): Observable<Pagination<TaskInterface>> {
  //   return from(paginate<TaskInterface>(this.taskRepository, options)).pipe(
  //       map((usersPageable: Pagination<TaskInterface>) => {
  //           return usersPageable;
  //       })
  //   )
  // }

  //!Search + Pagination: (Tìm kiếm + Phân trang)
  paginateFilterByTitle(options: IPaginationOptions, task: TaskInterface): Observable<Pagination<TaskInterface>>{
    return from(this.taskRepository.findAndCount({
        skip: Number(options.page) * Number(options.limit) || 0, //!page * limit = offset
        take: Number(options.limit) || 10,
        order: {id: "ASC"},
        relations: ['author', 'taskToCategories'],
        select: ['id', 'title', 'description', 'status', 'createdAt'],
        where: [
            { title: Like(`%${task.title}%`)}
        ]
    })).pipe(
        map(([tasks, totalTasks]) => {
            const tasksPageable: Pagination<TaskInterface> = {
                items: tasks,
                links: {
                    first: options.route + `?limit=${options.limit}`,
                    previous: options.route + ``,
                    next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                    last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalTasks / Number(options.limit))}`
                },
                meta: {
                    currentPage: Number(options.page),
                    itemCount: tasks.length,
                    itemsPerPage: Number(options.limit),
                    totalItems: totalTasks,
                    totalPages: Math.ceil(totalTasks / Number(options.limit))
                }
            };              
            return tasksPageable;
        })
    ) 
}

  //!Get Task By Id:
  async getTaskById(id: number): Promise<TaskEntity> {
    const taskFound = await this.taskRepository.findOne(id, {relations: ['author', 'taskToCategories']});
   
    if (!taskFound) { //Error Handle:
      throw new NotFoundException(`Task with ID ${id} not found !`);
    } else {

      // console.log(this.cacheManager.get('key'))
      return taskFound;
    }
   
  }

  // //!Update Task Status:
  // async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
  //   const task = await this.getTaskById(id);
  //   task.status = status;
  //   await task.save();
  //   return task;
  // }

  //!Update Task use CASL Role:
  async updateTask (id: number, updateTaskDto: UpdateTaskDto, user:UserEntity) : Promise<TaskEntity> {

    //todo: CASL isAdmin isCreator:
    const caslAbility = this.caslAbilityFactory.createForUser(user)
    const taskToUpdate = await this.getTaskById(id);
      ForbiddenError.from(caslAbility)
        .setMessage('only admin or creator!')
        .throwUnlessCan(Action.Update, taskToUpdate);

    //todo: Update
    const updatedTask = await this.taskRepository.findOne(id, {relations: ['author']})

    const { title, description, categoryIds } = updateTaskDto;

    if (title) { updatedTask.title = title }

    if (description != undefined || description) { updatedTask.description = description } //!Phải có @Optional() ở DTO thì mới update title mà ko cần update description

    if (categoryIds) {
      updatedTask.taskToCategories = [] ; //!Đặt = [] nên ko cần != undefined như description
  
      for (let i = 0; i < categoryIds.length; i++) {
        const category = await getRepository(CategoryEntity).findOne(categoryIds[i]);
        console.log(category)
  
        if (category) {
          const updateTaskToCategory = new TaskToCategoryEntity();
          updateTaskToCategory.taskId = updatedTask.id
          updateTaskToCategory.categoryId = category.id
  
          updatedTask.taskToCategories.push(updateTaskToCategory);
        } else {
          throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
        }
      }
  
    }
    // await this.clearCache(); //!Cache Manually
    return this.taskRepository.save(updatedTask)
   
  }

  //!Delete Task use CASL Role:
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) { //Error Handle:
      throw new NotFoundException(`Task with ID ${id} is not found !`);
    }
    // await this.clearCache(); //!Cache Manually
  }
}

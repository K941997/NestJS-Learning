/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksSearchFilterDto } from './dto/getTasksSearchFilter.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TaskStatusValidationPipe } from './custom pipes/taskStatusValidation.pipe';
import { TaskEntity } from './entity/task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './taskStatus.enum';
import { UserEntity } from 'src/auth/entity/user.entity';
import { RequestWithUser } from 'src/auth/interface/requestWithUser.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { JwtAuthGuard } from 'src/auth/utils/guard/jwtAuthGuard.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { Role } from 'src/auth/role/role.enum';
import { RolesGuard } from 'src/auth/role/roleGuard.guard';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/casl-action.enum';
import { ForbiddenError } from '@casl/ability';
import { PoliciesGuard } from 'src/casl/policiesGuard.guard';
import { CheckPolicies } from 'src/casl/casl-ability.decorator';
import { GET_CACHE_KEY } from 'src/cacheManully/cacheKey.constant';
import { Pagination } from 'nestjs-typeorm-paginate';
import { from, Observable } from 'rxjs';
import { TaskInterface } from './entity/task.interface';
@Controller('tasks') //localhost:3000/api/tasks/
@UseInterceptors(CacheInterceptor) //!Cache In-memory:
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private caslAbilityFactory: CaslAbilityFactory //add Casl to Role + isCreator
  ) {}

  //!Create A Task:
  @Post()
  //todo: Role Admin Premium thay bằng CASL isAdmin Role + isCreator:
  // @Roles(Role.ADMIN, Role.PREMIUM)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  
  @UsePipes(ValidationPipe)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser, //todo Task's Author
  ): Promise<TaskEntity> {
    console.log(req.user) //{ id: 1, role: "admin", ... } phục thuộc login trả jwttokenpayload ở AuthService

    return this.tasksService.createTask(createTaskDto, req.user);

  }

  // //!Get All Tasks + Get All Tasks Search Filter:
  // @Get() //Nếu thêm query thì sẽ hiện Tasks theo query hoặc không thêm query thì hiện tất cả:
  // @UseInterceptors(CacheInterceptor) //!In-memory Cache | Cache Manually:
  // // @CacheKey(GET_CACHE_KEY) //!Cache Manually
  // // @CacheTTL(120) //!Cache Manually
  // getTasksSearchFilter(
  //   @Query(ValidationPipe) filterDto: GetTasksSearchFilterDto,
  // ): Promise<TaskEntity[]> {
  //   return this.tasksService.getTasksSearchFilter(filterDto);
  // }

  // //!Pagination Infinite Scroll:
  // @Get() //Nếu thêm query thì sẽ hiện Tasks theo query hoặc không thêm query thì hiện tất cả:
  // @UseInterceptors(CacheInterceptor) //!In-memory Cache | Cache Manually:
  // // @CacheKey(GET_CACHE_KEY) //!Cache Manually
  // // @CacheTTL(120) //!Cache Manually
  // getTasksSelected(
  //   @Query('take') take: number = 1,
  //   @Query('skip') skip: number = 1
  // ): Promise<TaskEntity[]> {
  //   take = take > 20 ? 20 : take;
  //   return this.tasksService.getTasksSelected(take, skip);
  // }

  //!Get All Tasks + Pagination + SearchFilterByTitle:
  @Get() //Nếu thêm query thì sẽ hiện Tasks theo query hoặc không thêm query thì hiện tất cả:
  @UseInterceptors(CacheInterceptor) //!In-memory Cache | Cache Manually:
  // @CacheKey(GET_CACHE_KEY) //!Cache Manually
  // @CacheTTL(120) //!Cache Manually
  index(
    @Query('page') page: number = 1, //page * limit = offset
    @Query('limit') limit: number = 4,
    @Query('title') title: string
  ): Observable<Pagination<TaskInterface>> {
      limit = limit > 100 ? 100 : limit;
      if (title === null || title === undefined) {
        return this.tasksService.paginate(
          {
            page: Number(page), 
            limit: Number(limit), 
            route: 'http://localhost:3000/api/tasks',  
          },
        );
    } else if (title) {
        return this.tasksService.paginateFilterByTitle(
            {
              page: Number(page),
              limit: Number(limit),
              route: 'http://localhost:3000/api/tasks',
            },
            { title }
        );
    }
  }


  //!Get Task By Id:
  @Get('/:id')
  @UseInterceptors(CacheInterceptor) //!In-memory Cache | Cache Manually:
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id);
  }

  // //!Update Task Status:
  // @UseGuards(JwtAuthGuard)
  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  // ): Promise<TaskEntity> {
  //   return this.tasksService.updateTaskStatus(id, status);
  // }

  //!Update Task Advanced CASL Role:
  @Patch('/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, TaskEntity))
  @UsePipes(ValidationPipe)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: RequestWithUser, //req from JwtAuthGuard
  ): Promise<TaskEntity> {
    //todo: CASL to Role + isCreator:
    //todo: CASL to Service:
    const user = req.user

    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  //!Delete Task Advanced CASL Role isAdmin isCreator:
  @Delete('/:id')
  //!Cách 1:
  @UseGuards(JwtAuthGuard) //!JwtAuthGuard
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    // @Param() param //!Dành cho Delete Multi
    // @Query('keys') keys: string[] //!Dành cho Delete Multi
    // @Body() deleteTopicMulti: DeleteTopicMultiDto //!Dành cho Delete Multi
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const user = req.user
    //todo: CASL Basic:
    //todo: CASL isAdmin isCreator:
    const caslAbility = this.caslAbilityFactory.createForUser(user)
    const taskToDelete = await this.getTaskById(id);

    try {
      ForbiddenError.from(caslAbility)
        .throwUnlessCan(Action.Delete, taskToDelete);
      return this.tasksService.deleteTask(id);
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }

  // //!Cách 2: Chưa xong:
  // //!CASL Advanced: Implementing a PoliciesGuard:
  // //todo: CASL Advanced: Implementing a PoliciesGuard:
  // @UseGuards(JwtAuthGuard, PoliciesGuard) //!JwtAuthGuard + CASL Advanced
  // @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, TaskEntity)) //!CASL Advanced
  // async deleteTask(
  //   @Param('id', ParseIntPipe) id: number,
  //   // @Req() req: RequestWithUser, //req from JwtAuthGuard
  // ): Promise<void> {
  //   // const user = req.user

   
  //   return this.tasksService.deleteTask(id);
  // }



}

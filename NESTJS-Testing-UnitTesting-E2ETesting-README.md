$ npm i --save-dev @nestjs/testing
Gồm có: Unit Testing, Intergration Testing, E2E Testing
###### Unit Testing:
# level.service.unit.spec.ts:
- $ npm run test:watch
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { LevelService } from '../../level.service';
import { Level } from '../../entities/level.entity';
import { LevelTranslation } from '../../entities/level-translation.entity';
import { TranslateService } from '../../../utils-module/services/translate.service';
import { CreateLevelDto } from '../../dto/create-level.dto';
import { BooleanEnum, LangEnum } from '../../../common/constants/global.constant';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindManyLevelsDto, FindOneLevelDto } from '../../../level/dto/find-level.dto';
import { UpdateLevelDto } from '../../../level/dto/update-level.dto';
import { DeleteResult, Repository } from 'typeorm';

import * as sinon from 'sinon'; //sinon mock Repository

//!mock Creator, User, Admin:
// const mockRequest = httpMocks.createRequest();
// mockRequest.user = new User(); //!table Relation
// mockRequest.user.firstName = "Khanh"; //!table Relation

const mockDeleteResult: DeleteResult = { //normal
  raw: [],
  affected: 1,
}

class mockLevelService { //normal
  create(createLevelDto: CreateLevelDto){ 
    return {
      ...createLevelDto,
    };
  }
  findAllByAdmin(
    options: IPaginationOptions,
    params: FindManyLevelsDto,
  ) {
    const page = options.page;
    const limit = options.limit;
    return {
      page,
      limit,
      ...params
    }
  }
  findOne(key: string, params: FindOneLevelDto) {
    return {
      key,
      ...params
    }
  }
  update(key: string, updateLevelDto: UpdateLevelDto) {
    return {
      key,
      ...updateLevelDto,
    }
  }
  remove() {
    return mockDeleteResult;
  }
  removeMulti() {
    return mockDeleteResult;
  }
}

describe.only('LevelService', () => {
  let levelService: LevelService;
  // let sandbox: sinon.SinonSandbox; //sinon mock Repository
  // let jestMock: jest.Mock; //jest mock

  beforeAll(async () => {
    // sandbox = sinon.createSandbox(); //sinon mock Repository
    // jestMock = jest.fn(); //jest mock

    const mockLevelServiceProvider = { //normal
      provide: LevelService,
      useClass: mockLevelService,
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [ //!Write Custom Provider or LevelService Constructor's items or Use .override().useValue()
        LevelService,
        mockLevelServiceProvider, //normal
        // {
        //   provide: getRepositoryToken(Level), 
        //   useValue: sinon.createStubInstance(Repository) //sinon mock Repository
        //   useValue: { jestMock } //jest mock
        // }
      ],
    }).compile();

    levelService = module.get<LevelService>(LevelService);
    // levelService = await module.get(LevelService); //sinon mock Repository      

  });

  it('should be defined', () => {
    expect(levelService).toBeDefined();
  })

  it('should create a level by admin', async () => {
    const dto = new CreateLevelDto();
    const createLevelSpy = jest.spyOn(levelService, 'create');
    levelService.create(dto);
    expect(createLevelSpy).toHaveBeenCalledWith(dto);
  })

  it('should find all levels by admin', async () => {
    const dto = new FindManyLevelsDto();
    const paginationOptions = { page: 1, limit: 10 }
    const findManyLevelsSpy = jest.spyOn(levelService, 'findAllByAdmin');
    levelService.findAllByAdmin(paginationOptions, dto);
    expect(findManyLevelsSpy).toHaveBeenCalledWith(paginationOptions, dto);
  })

  it('should find one level by admin', async () => {
    const dto = new FindOneLevelDto();
    const levelKey = "level 1";
    const findOneLevelSpy = jest.spyOn(levelService, 'findOne');
    levelService.findOne(levelKey, dto);
    expect(findOneLevelSpy).toHaveBeenCalledWith(levelKey, dto)
  })

  it('should update one level by admin', async () => {
    const dto = new UpdateLevelDto();
    const levelKey = 'level 1';
    const updateOneLevelSpy = jest.spyOn(levelService, 'update');
    levelService.update(levelKey, dto);
    expect(updateOneLevelSpy).toHaveBeenCalledWith(levelKey, dto);
  })

  it('should remove one level by admin', async () => {
    const levelKey = 'level 1';
    const removeOneLevelSpy = jest.spyOn(levelService, 'remove');
    levelService.remove(levelKey);
    expect(removeOneLevelSpy).toHaveBeenCalledWith(levelKey);
  })

  it('should remove multi levels by admin', async () => {
    const levelKeys = ['level 1', 'level 2']
    const removeMultiLevelsSpy = jest.spyOn(levelService, 'removeMulti');
    levelService.removeMulti(levelKeys);
    expect(removeMultiLevelsSpy).toHaveBeenCalledWith(levelKeys);
  })

  // afterAll(async () => { //sinon mock Repository
  //   sandbox.restore();
  // });

});



# level.controller.unit.spec.ts:
import { Test, TestingModule } from '@nestjs/testing';
import { LevelClientController } from '../../controllers/level-client.controller';
import { BooleanEnum, LangEnum } from '../../../common/constants/global.constant';
import { LevelAdminController } from '../../controllers/level-admin.controller';
import { LevelService } from '../../level.service';
import { Level } from '../../entities/level.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateLevelDto } from '../../dto/create-level.dto';
import { UpdateLevelDto } from '../../dto/update-level.dto';
import { FindManyLevelsDto, FindOneLevelDto } from '../../dto/find-level.dto';
import { DeleteResult, getRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const httpMocks = require('node-mocks-http');

describe('LevelController', () => {
  let levelAdminController: LevelAdminController;
  let levelClientController: LevelClientController
  let levelService: LevelService;

  //!mock Creator, User, Admin:
  // const mockRequest = httpMocks.createRequest();
  // mockRequest.user = new User(); //!table Relation
  // mockRequest.user.firstName = "Khanh"; //!table Relation

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  }

  const mockLevelService = {
    create: jest.fn().mockImplementation((createLevelDto: CreateLevelDto) => {
      return {
        ...createLevelDto,
      };
    }),
    findAllByAdmin: jest.fn().mockImplementation((
      options: IPaginationOptions,
      params: FindManyLevelsDto,
    ) => {
      const page = options.page;
      const limit = options.limit;
      return {
        page,
        limit,
        ...params
      }
    }),
    findOne: jest.fn().mockImplementation((key: string, params: FindOneLevelDto) => {
      return {
        key,
        ...params
      }
    }),
    update: jest.fn().mockImplementation((key: string, updateLevelDto: UpdateLevelDto) => ({
      key,
      ...updateLevelDto,
    })),
    remove: jest.fn().mockImplementation(() => {
      return mockDeleteResult;
    }),
    removeMulti: jest.fn().mockImplementation(() => {
      return mockDeleteResult;
    })
  };

  // const mockUserService = {}; //!table Relation

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [LevelAdminController, LevelClientController],
      providers: [ //!Write LevelService Constructor's items or Use .override().useValue()
        LevelService,
        // { provide: getRepositoryToken(Level), useValue: mockLevelRepository }
        // { provide: UserService, useValue: mockUserService }, //!table Relation
        // { provide: JwtGuard, useValue: jest.fn().mockImplementation(() => true) }, //!table Relation
        // { provide: CASLGuard, useValue: jest.fn().mockImplementation(() => true) }, //!table Relation
      ],
    })
      .overrideProvider(LevelService) 
      .useValue(mockLevelService)
      .compile();

    levelAdminController = module.get<LevelAdminController>(LevelAdminController); 
    levelClientController = module.get<LevelClientController>(LevelClientController);

    levelService = module.get<LevelService>(LevelService);
    // userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(levelAdminController).toBeDefined();
  });

  it('should create a level by admin', async () => {
    const mockLevel: CreateLevelDto = { //dto create
      key: 'level mock 11',
      description: 'this is level mock 11',
      enabled: BooleanEnum.TRUE,
      name: 'cap do mock 11',
      lang: LangEnum.Vi,
      // author: mockRequest.user //!table relation
    }
    expect(await levelAdminController.create(mockLevel)).toEqual({
      ...mockLevel
    })
    expect(await mockLevelService.create).toHaveBeenCalledWith(mockLevel);
  })

  it('should find all levels by admin', async () => {
    const mockFindManyLevels: FindManyLevelsDto = {
      slug: 'level-mock-11',
      lang: LangEnum.En,
      enabled: BooleanEnum.TRUE,
    }
    expect(await levelAdminController.findAllByAdmin(-1, 10, mockFindManyLevels)).toStrictEqual({ //! trả về pagination như service
       page: -1,
       limit: 10,
      ...mockFindManyLevels,
    })
    expect(await mockLevelService.findAllByAdmin).toHaveBeenCalled();
  })

  it('should get one levels', async () => {
    const mockFindOneLevel: FindOneLevelDto = {
      lang: LangEnum.En,
      enabled: BooleanEnum.TRUE,
    }
    expect(await levelAdminController.findOne('level mock 11', mockFindOneLevel)).toStrictEqual({
      key: 'level mock 11',
      ...mockFindOneLevel,
    })
    expect(await mockLevelService.findOne).toHaveBeenCalled();
  })

  it('should update a level by admin', async () => {
    const mockUpdateLevel: UpdateLevelDto = {
      description: 'day la cap do mock 111',
      enabled: BooleanEnum.FALSE,
      name: 'level mock 111',
      lang: LangEnum.En,
    }
    expect(await levelAdminController.update('level mock 11', mockUpdateLevel)).toEqual({
      key: 'level mock 11',
      ...mockUpdateLevel
    })
    expect(await mockLevelService.update).toHaveBeenCalled();
  })

  it('should delete a level by admin', async () => {
    expect(await levelAdminController.remove('level mock 11')).toEqual(mockDeleteResult)
  })

  it('should delete multi level by admin', async () => {
    expect(await levelAdminController.removeMulti(['level mock 11', 'level mock 12'])).toEqual(mockDeleteResult);
  })
});


###### E2E Testing:

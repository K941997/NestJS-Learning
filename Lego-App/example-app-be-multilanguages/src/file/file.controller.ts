import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthenGuard } from '../auth/guard/firebase-authen.guard';
import { SupportFileType } from '../common/constants/global.constant';
import { GetUser } from '../common/decorators/auth.decorator';
import { ManualSerialize } from '../common/interceptors/serialize.interceptor';
import { User } from '../user/entities/user.entity';
import { CreateFileRes } from './dto/res/create-file-res.dto';
import { FileService } from './file.service';

@Controller('file')
@ApiTags('File')
@UseGuards(FirebaseAuthenGuard)
@ApiBearerAuth()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: { type: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: 'Upload new file' })
  @ApiOkResponse({ type: CreateFileRes })
  @ManualSerialize(CreateFileRes)
  @Post('presigned-url')
  createPresignUrl(@Body('type') type: SupportFileType, @GetUser() user: User) {
    return this.fileService.createPresignUpload(type, user);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: { url: { type: 'string' } },
    },
  })
  @Post('upload-image')
  uploadFromUrl(@Body('url') url: string) {
    return this.fileService.uploadFromUrl(url);
  }
}

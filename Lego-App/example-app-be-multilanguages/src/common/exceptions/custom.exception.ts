import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';

export class ForbiddenExc extends ForbiddenException {
  constructor(private errMsg: string = 'Forbidden Exception!') {
    super(errMsg);
  }
}
export class NotFoundExc extends NotFoundException {
  constructor(private errMsg: string = 'Not Found!') {
    super(errMsg);
  }
}

export class UnauthorizedExc extends UnauthorizedException {
  constructor(private errMsg: string = 'Please login!!!') {
    super(errMsg);
  }
}

export class ConflictExc extends ConflictException {
  constructor(private errMsg: string = 'Conflict Resource Exception') {
    super(errMsg);
  }
}

export class BadRequestExc extends BadRequestException {
  constructor(private errMsg: string = 'Bad request') {
    super(errMsg);
  }
}

export class InternalServerErrorExc extends InternalServerErrorException {
  constructor(
    private errMsg: string = 'Server is meeting some internal error. Please try on later!',
  ) {
    super(errMsg);
  }
}

export class ExpectationFailedExc extends HttpException {
  constructor(errMsg?: string) {
    super(errMsg, 417);
  }
}

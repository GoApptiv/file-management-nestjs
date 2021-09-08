import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { RestResponseService } from '../services/rest-response.service';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();

    res
      .status(status)
      .json(
        RestResponseService.buildResponseError(
          status,
          exception.message,
          exception.getResponse(),
        ),
      );
  }
}

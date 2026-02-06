import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class BodyRequiredPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      if (!value) {
        throw new BadRequestException('Тело запроса обязательно');
      }
    }
    return value;
  }
}
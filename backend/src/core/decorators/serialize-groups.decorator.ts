import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';

export function SerializeGroups(...groups: string[]) {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({ groups }),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

export function ApiFileBody() {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          media: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

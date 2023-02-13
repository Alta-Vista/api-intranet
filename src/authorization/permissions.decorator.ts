/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

const Permissions = (...permissions: string[]) =>
    SetMetadata('permissions', permissions);

export { Permissions };

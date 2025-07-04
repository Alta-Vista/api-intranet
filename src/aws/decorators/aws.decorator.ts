import { Inject } from '@nestjs/common';
import { ClassDefinition } from '../interfaces';

export const AWSClient = <C extends ClassDefinition>(client: C) => {
  const providerToken = `${client.name}`;

  return Inject(providerToken);
};

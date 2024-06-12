import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IsPublic = Reflector.createDecorator();

import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
@Injectable()
export class UserController {}

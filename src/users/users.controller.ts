import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('my')
  @Auth()
  getCurrentUser(@GetUser() user: User) {
    return this.usersService.getCurrentUser(user);
  }

  // TODO: Revisar el frontend donde se utiliza este metodo porque deberia ser solo admin
  @Auth()
  @Get(':userId')
  getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.findById(userId);
  }

  // TODO: Revisar el frontend donde se utiliza este metodo porque deberia ser solo admin
  @Auth()
  @Get()
  getUsers(@Query() userPaginationDto: UserPaginationDto) {
    return this.usersService.findAll(userPaginationDto);
  }

  @Auth()
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.updateUser(updateUserDto, user);
  }

  @Auth()
  @Post('disable')
  disableUser(@GetUser() user: User) {
    return this.usersService.disableUser(user);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}

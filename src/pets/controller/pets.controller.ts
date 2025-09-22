import {Controller, Get, Post, Body, Param, Delete, Put,UseGuards, Request, ForbiddenException,} from '@nestjs/common';
import { PetsService } from '../service/pets.service';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { Pet } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import type { Request as ExpressRequest } from 'express';

type AuthUser = { id: number; username: string; email: string };
type RequestWithUser = ExpressRequest & { user?: AuthUser };

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPetDto: CreatePetDto, @Request() req: RequestWithUser): Promise<Pet> {
    const authUser = req.user;
    if (authUser && !createPetDto.userId) {
      return this.petsService.create(createPetDto, authUser.id);
    }
    if (authUser && createPetDto.userId && createPetDto.userId !== authUser.id) {
      throw new ForbiddenException('You can only create a pet for your own account');
    }
    return this.petsService.create(createPetDto, createPetDto.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pet> {
    return this.petsService.getPet(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Pet[]> {
    return this.petsService.getPetsByUser(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
    @Request() req: RequestWithUser,
  ): Promise<Pet> {
    const authUser = req.user;
    const pet = await this.petsService.getPet(+id);
    if (pet.userId && authUser && pet.userId !== authUser.id) {
      throw new ForbiddenException('You are not the owner of this pet');
    }
    return this.petsService.update(+id, updatePetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/assign')
  async assignToUser(
    @Param('id') id: string,
    @Body('userId') bodyUserId: number,
    @Request() req: RequestWithUser,
  ): Promise<Pet> {
    const authUser = req.user;
    if (!bodyUserId) {
      throw new ForbiddenException('userId is required in body to assign pet');
    }
    if (authUser && bodyUserId !== authUser.id) {
      throw new ForbiddenException('You can only assign a pet to your own account');
    }
    return this.petsService.assignPetToUser(+id, bodyUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: RequestWithUser): Promise<Pet> {
    const authUser = req.user;
    const pet = await this.petsService.getPet(+id);
    if (pet.userId && authUser && pet.userId !== authUser.id) {
      throw new ForbiddenException('You are not the owner of this pet');
    }
    return this.petsService.remove(+id);
  }
}

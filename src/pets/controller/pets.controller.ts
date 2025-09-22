import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PetsService } from '../service/pets.service';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { Pet } from '@prisma/client';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  async create(@Body() createPetDto: CreatePetDto): Promise<Pet> {
    return this.petsService.create(createPetDto);
  }

  @Get()
  async findAll(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Pet> {
    return this.petsService.getPet(+id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Pet[]> {
    return this.petsService.getPetsByUser(+userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    return this.petsService.update(+id, updatePetDto);
  }

  @Put(':id/assign/:userId')
  async assignToUser(@Param('id') id: string, @Param('userId') userId: string): Promise<Pet> {
    return this.petsService.assignPetToUser(+id, +userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pet> {
    return this.petsService.remove(+id);
  }
}

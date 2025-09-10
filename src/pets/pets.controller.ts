import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
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
  async findOne(@Param('id') id: string): Promise<Pet | null> {
    return this.petsService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<Pet> {
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pet> {
    return this.petsService.remove(+id);
  }
}

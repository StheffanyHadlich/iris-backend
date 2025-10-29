import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AdoptionService } from '../service/adoption.service';
import { CreateAdoptionDto } from '../dto/create-adoption.dto';
import { UpdateAdoptionDto } from '../dto/update-adoption.dto';

@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @Post()
  create(@Body() createAdoptionDto: CreateAdoptionDto) {
    return this.adoptionService.create(createAdoptionDto);
  }

  @Get()
  findAll() {
    return this.adoptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdoptionDto) {
    return this.adoptionService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionService.remove(+id);
  }
}

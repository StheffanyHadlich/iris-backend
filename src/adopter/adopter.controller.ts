import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AdopterService } from './adopter.service';
import { CreateAdopterDto } from './dto/create-adopter.dto';
import { UpdateAdopterDto } from './dto/update-adopter.dto';

@Controller('adopter')
export class AdopterController {
  constructor(private readonly adopterService: AdopterService) {}

  @Post()
  create(@Body() createAdopterDto: CreateAdopterDto) {
    return this.adopterService.create(createAdopterDto);
  }

  @Get()
  findAll() {
    return this.adopterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adopterService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAdopterDto: UpdateAdopterDto) {
    return this.adopterService.update(+id, updateAdopterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adopterService.remove(+id);
  }
}

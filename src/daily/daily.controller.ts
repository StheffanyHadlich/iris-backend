import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { DailyService } from './daily.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';

@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Post()
  create(@Body() createDailyDto: CreateDailyDto) {
    return this.dailyService.create(createDailyDto);
  }

  @Get()
  findAll() {
    return this.dailyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDailyDto: UpdateDailyDto) {
    return this.dailyService.update(+id, updateDailyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyService.remove(+id);
  }
}

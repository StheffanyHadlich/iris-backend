import { Controller, Post, Get, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { DiaryService } from '../service/daily.service';
import { CreateDiaryDto } from '../dto/create-daily.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('pets/diary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @ApiOperation({ summary: 'Create diary entry for pet (owner only)' })
  @ApiParam({ name: 'petId', type: Number })
  @ApiBody({ type: CreateDiaryDto })
  @ApiResponse({ status: 201, description: 'Diary entry created' })
  async create(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() dto: CreateDiaryDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.diaryService.create(petId, dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List diary entries for pet (owner only)' })
  @ApiParam({ name: 'petId', type: Number })
  @ApiResponse({ status: 200, description: 'Array of diary entries' })
  async list(@Param('petId', ParseIntPipe) petId: number, @Req() req: { user: { id: number } }) {
    return this.diaryService.list(petId, req.user.id);
  }
}

import { Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { PetsService } from '../service/pets.service';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';
import { Pet } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

type ReqWithUser = {
  user: {
    id: number;
    username: string;
    email: string;
  };
};

@ApiTags('pets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pet (associates to authenticated user).' })
  @ApiBody({ type: CreatePetDto })
  @ApiResponse({ status: 201, description: 'Pet created.' })
  async create(
    @Body() createPetDto: CreatePetDto,
    @Req() req: ReqWithUser,
  ): Promise<Pet> {
    const authUserId = req.user.id;
    return this.petsService.create(createPetDto, authUserId);
  }

  @Get()
  @ApiOperation({ summary: 'List pets for the authenticated user.' })
  @ApiResponse({ status: 200, description: 'Array of pets.' })
  async findAll(@Req() req: ReqWithUser): Promise<Pet[]> {
    const authUserId = req.user.id;
    return this.petsService.getPetsByUser(authUserId);
  }

  @Get('species')
  @ApiOperation({ summary: 'List available pet species options.' })
  @ApiResponse({ status: 200, description: 'Array of species strings.' })
  async getSpecies(): Promise<{ value: string; label: string }[]> {
    return [
      { value: 'DOG', label: 'Dog 🐶' },
      { value: 'CAT', label: 'Cat 🐱' },
      { value: 'BIRD', label: 'Bird 🐦' },
      { value: 'OTHER', label: 'Other 🐾' },
    ];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single pet by id (only if owned by authenticated user).' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pet found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: ReqWithUser,
  ): Promise<Pet> {
    const authUserId = req.user.id;
    return this.petsService.getPet(id, authUserId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pet (owner only).' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePetDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
    @Req() req: ReqWithUser,
  ): Promise<Pet> {
    const authUserId = req.user.id;
    return this.petsService.update(id, updatePetDto, authUserId);
  }

  @Put(':id/assign/:userId')
  @ApiOperation({ summary: 'Assign existing pet to a user (owner only or same user).' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'userId', type: Number })
  async assignToUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: ReqWithUser,
  ): Promise<Pet> {
    const authUserId = req.user.id;
    if (userId !== authUserId) {
      throw new ForbiddenException('Cannot assign pet to another user.');
    }
    return this.petsService.assignPetToUser(id, userId, authUserId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pet (owner only).' })
  @ApiParam({ name: 'id', type: Number })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: ReqWithUser,
  ): Promise<Pet> {
    const authUserId = req.user.id;
    return this.petsService.remove(id, authUserId);
  }
}

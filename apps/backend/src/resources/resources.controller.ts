import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { ResourcesService } from './resources.service';

@Controller({ path: 'resources', version: '1' })
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('create')
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @Get('all')
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get(':id')
  findOne(id: string) {
    return this.resourcesService.findOne(id);
  }

  @Get('test')
  test() {
    return this.resourcesService.findAll();
  }
}

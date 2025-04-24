import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { WatchService } from '../services/watch.service';
import { CreateWatchDto } from '../dto/create-watch.dto';
import { UpdateWatchDto } from '../dto/update-watch.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('watch')
export class WatchController {
    constructor(private readonly watchService: WatchService) { }

    @ApiOperation({ summary: 'Créer une nouvelle la moontre' }) // Description de l'opération
    @ApiCreatedResponse({type: CreateWatchDto})
    @ApiBadRequestResponse() // Type de la réponse
    
    @Post()
    create(@Body() createWatchDto: CreateWatchDto) {
        return this.watchService.create(createWatchDto);
    }

    @ApiOperation({ summary: 'Afficher toutes les watches' })
    @Get()
    findAll() {
        return this.watchService.findAll();
    }

    @ApiOperation({ summary: 'Afficher une watch' })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.watchService.findOne(id);
    }

    @ApiOperation({ summary: 'Modifier une watch' })
    @Patch(':id')
    update(@Param('id') id: number, @Body() updateWatchDto: UpdateWatchDto) {
        return this.watchService.update(+id, updateWatchDto);
    }

    @ApiOperation({ summary: 'Supprimer une watch' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.watchService.remove(+id);
    }
}

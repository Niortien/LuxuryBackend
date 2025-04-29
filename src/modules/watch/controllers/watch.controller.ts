import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { WatchService } from '../services/watch.service';
import { CreateWatchDto } from '../dto/create-watch.dto';
import { UpdateWatchDto } from '../dto/update-watch.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('watch')
export class WatchController {
    constructor(private readonly watchService: WatchService) { }

    @ApiOperation({ summary: 'Créer une nouvelle la moontre' }) // Description de l'opération
    @ApiCreatedResponse({ type: CreateWatchDto })
    @ApiBadRequestResponse() // Type de la réponse

    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const filename = `image-${Date.now()}${extname(file.originalname)}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        }
    }))
    @Post()
    create(@Body() createWatchDto: CreateWatchDto, @UploadedFile() image: Express.Multer.File) {
        return this.watchService.create({ ...createWatchDto, pathi: image.path || "" });
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

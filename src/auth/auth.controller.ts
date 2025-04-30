import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InscriptionDto } from './dto/inscription.dto';
import { ConnexionDto } from './dto/connexion.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Inscription utilisateur" })
  @ApiBadRequestResponse({ description: "Utilisateur existe déjà." })
  @ApiCreatedResponse({ description: "Utilisateur créé avec succès." })
  @Post("/inscription")
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/users',
      filename: (req, file, callback) => {
        const filename = `avatar-${Date.now()}${extname(file.originalname)}`;
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
  inscription(@Body() inscriptionDto: InscriptionDto, @UploadedFile() image: Express.Multer.File) {
    return this.authService.inscription({ ...inscriptionDto, avatar: image.path || "" });
  }

  @ApiOperation({ summary: "Connexion utilisateur" })
  @Post("/connexion")
  connexion(@Body() connexionDto: ConnexionDto) {
    return this.authService.connexion(connexionDto);
  }

  @ApiOperation({ summary: "Profile utilisateur" })

  @UseGuards(AuthGuard)
  @Get("/profile")
  profile(@Req() req: Request) {
    return this.authService.profile(req);
  }

}

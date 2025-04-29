import { BadRequestException, Injectable } from '@nestjs/common';
import { InscriptionDto } from './dto/inscription.dto';
import { ConnexionDto } from './dto/connexion.dto';
import { PrismaService } from 'src/database/prisma.service';
import { HachageService } from 'src/hachage/hachage.service';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '@prisma/client';
import { jwtConstants } from './constants/JWTConstants';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hachageService: HachageService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }



  async inscription(inscriptionDto: InscriptionDto) {

    //  Check if user exist
    const userExist = await this.userService.findOneByEmail(inscriptionDto.email);
    if (userExist) {
      throw new BadRequestException('Utilisateur existe déjà.');
    }
    // Hash Password
    const hashedPassword = await this.hachageService.hashPassword(inscriptionDto.password);

    // Create User
    const user = await this.userService.create({
      ...inscriptionDto,
      password: hashedPassword
    });

    const { password, updatedAt, ...rest } = user;
    return rest;
  }

  async connexion(connexionDto: ConnexionDto) {

    // Find User
    const userExist = await this.userService.findOneByEmail(connexionDto.email);
    if (!userExist) {
      throw new BadRequestException('Vous n\'etes pas inscrit.');
    }
    // Compare Password
    const passwordHash = await this.hachageService.comparePassword(connexionDto.password, userExist.password);
    if (!passwordHash) {
      throw new BadRequestException('Mot de passe incorrect.');
    }
    // Generate Token

    const payload = {
      id: userExist.id,
      email: userExist.email
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: "10s"
    });

    const { password, updatedAt, ...rest } = userExist;
    return { token, user: rest };
  }

  async profile(req: Request) {
    const { user } = req as any;

    return user;
  }
}

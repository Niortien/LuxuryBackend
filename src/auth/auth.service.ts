import { BadRequestException, Injectable } from '@nestjs/common';
import { InscriptionDto } from './dto/inscription.dto';
import { ConnexionDto } from './dto/connexion.dto';
import { PrismaService } from 'src/database/prisma.service';
import { HachageService } from 'src/hachage/hachage.service';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants/JWTConstants';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hachageService: HachageService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }


// la fonction Inscription
//on crée une méthode d'inscription qui prend un objet InscriptionDto
//cette méthode est responsable de l'inscription d'un nouvel utilisateur
  async inscription(inscriptionDto: InscriptionDto) {

    //  Check if user exist
    //on verifie si l'utilisateur existe déjà dans la base de données
    //on utilise le service utilisateur pour trouver l'utilisateur par son email
    //si l'utilisateur existe déjà, on lance une exception BadRequestException
    const userExist = await this.userService.findOneByEmail(inscriptionDto.email);
    if (userExist) {
      throw new BadRequestException('Utilisateur existe déjà.');
    }
    // Hash Password
    //on hache le mot de passe de l'utilisateur avant de l'enregistrer dans la base de données
    //on utilise le service de hachage pour hacher le mot de passe
    const hashedPassword = await this.hachageService.hashPassword(inscriptionDto.password);

    // Create User
    //on crée un nouvel utilisateur dans la base de données en utilisant le service utilisateur
    //on passe le mot de passe haché et les autres informations de l'utilisateur
    const user = await this.userService.create({
      ...inscriptionDto,
      password: hashedPassword
    });
    // Generate Token
    //on génère un token JWT pour l'utilisateur nouvellement créé
    const { password, updatedAt, ...rest } = user;
    return rest;
  }

  // Connexion
  //on crée une méthode de connexion qui prend un objet ConnexionDto
  //cette méthode est responsable de la connexion d'un utilisateur existant
  //on vérifie si l'utilisateur existe dans la base de données en utilisant le service utilisateur
  //on compare le mot de passe fourni par l'utilisateur avec le mot de passe haché stocké dans la base de données
  //si les mots de passe correspondent, on génère un token JWT pour l'utilisateur
  //on utilise le service JWT pour signer le token avec les informations de l'utilisateur
  //on renvoie le token et les informations de l'utilisateur (sans le mot de passe)
  //on utilise le service utilisateur pour trouver l'utilisateur par son email
  //on passe l'email de l'utilisateur à la méthode findOneByEmail du service utilisateur
  async connexion(connexionDto: ConnexionDto) {

    // Find User
    //on vérifie si l'utilisateur existe dans la base de données en utilisant le service utilisateur
    //on passe l'email de l'utilisateur à la méthode findOneByEmail du service utilisateur
    const userExist = await this.userService.findOneByEmail(connexionDto.email);
    if (!userExist) {
      throw new BadRequestException('Vous n\'etes pas inscrit.');
    }
    // Compare Password
    //on compare le mot de passe fourni par l'utilisateur avec le mot de passe haché stocké dans la base de données
    //on utilise le service de hachage pour comparer les mots de passe
    const passwordHash = await this.hachageService.comparePassword(connexionDto.password, userExist.password);
    if (!passwordHash) {
      throw new BadRequestException('Mot de passe incorrect.');
    }
    // Generate Token
    //on génère un token JWT pour l'utilisateur
    //on utilise le service JWT pour signer le token avec les informations de l'utilisateur

    const payload = {
      id: userExist.id,
      email: userExist.email
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: "1h"
    });

    const { password, updatedAt, ...rest } = userExist;
    return { token, user: rest };
  }

  async profile(req: Request) {
    const { user } = req as any;

    return user;
  }
}

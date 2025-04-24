import { Injectable } from '@nestjs/common';
import { CreateWatchDto } from '../dto/create-watch.dto';
import { UpdateWatchDto } from '../dto/update-watch.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WatchService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createWatchDto: CreateWatchDto) {
        return this.prismaService.watch.create({
            data: createWatchDto
        })
    }

    async findAll() {
        return this.prismaService.watch.findMany()
    }

    async findOne(id: number) {
        return this.prismaService.watch.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, updateWatchDto: UpdateWatchDto) {
        return this.prismaService.watch.update({
            where: {
                id
            },
            data: updateWatchDto
        })
    }

    async remove(id: number) {
        return this.prismaService.watch.delete({
            where: {
                id
            }
        })
    }
}

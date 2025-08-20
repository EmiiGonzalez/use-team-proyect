import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBoardMemberDto, UpdateBoardMemberDto, ListBoardMembersQueryDto } from '../dtos/board-member.dtos';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { BoardMember } from '@prisma/client';

@Injectable()
export class BoardMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBoardMemberDto, idUser: string) {
    const boardMember : BoardMember | null = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId: dto.boardId, userId: idUser } },
    });
    if (boardMember?.role == 'VIEWER') throw new UnauthorizedException('No tienes permisos para realizar esto');

    return this.prisma.boardMember.create({ data: dto });
  }

  async findAll(query: ListBoardMembersQueryDto) {
    const { boardId, userId, role } = query;
    return this.prisma.boardMember.findMany({
      where: { boardId, userId, role },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: string) {
    const found = await this.prisma.boardMember.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('BoardMember no encontrado');
    return found;
  }

  async update(id: string, dto: UpdateBoardMemberDto) {
    await this.ensureExists(id);
    return this.prisma.boardMember.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.boardMember.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.boardMember.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('BoardMember no encontrado');
  }
}

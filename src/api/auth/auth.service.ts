import { Injectable } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { v4 } from 'uuid';
import { EntityAlreadyExistsException } from '../../utils/exception/entity-already-exists.exception';
import { EmailTokenNotFoundException } from '../../utils/exception/email-token-not-found.exception';
import { UnauthorizedException } from '../../utils/exception/unauthorized.exception';
import { SignInDto } from './dto/sign-in.dto';
import { EntityNotFoundException } from '../../utils/exception/entity-not-found.exception';
import * as bcrypt from 'bcryptjs';
import { PasswordIsNotValidException } from '../../utils/exception/password-is-not-valid.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private tempUsers = new Map<string, SignUpDto>();

  private async sendVerificationEmail(to: string): Promise<string> {
    const token = v4();
    await this.mailService.send({
      to,
      subject: 'Email verification on Questly.com',
      message: 'Please click the link below to verify your email address:',
      link: `${process.env.FRONT_BASE_URL}/auth/approve-email/?token=${token}&email=${to}`,
    });
    return token;
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const rec = [...this.tempUsers].find(
      ([, value]) => value.email === signUpDto.email,
    );
    if (rec) {
      throw new EntityAlreadyExistsException('User', 'email');
    }
    const existsByEmail = await this.prisma.user.findFirst({
      where: { email: signUpDto.email },
    });
    if (existsByEmail) throw new EntityAlreadyExistsException('User', 'email');
    const existsByNickname = await this.prisma.user.findFirst({
      where: { email: signUpDto.username },
    });
    if (existsByNickname) {
      throw new EntityAlreadyExistsException('User', 'nickname');
    }
    const token = await this.sendVerificationEmail(signUpDto.email);
    this.tempUsers.set(token, signUpDto);
  }

  async approveEmail(token: string): Promise<string> {
    const signUpDto = this.tempUsers.get(token);
    if (!signUpDto) {
      throw new EmailTokenNotFoundException();
    }
    const user = await this.prisma.user.create({
      data: {
        ...signUpDto,
        password: await this.hashPassword(signUpDto.password),
      },
    });
    this.tempUsers.delete(token);
    return this.jwtService.sign({ sub: user.id });
  }

  async resendEmail(email: string): Promise<void> {
    const rec = [...this.tempUsers].find(([, value]) => value.email === email);
    if (!rec) {
      throw new UnauthorizedException();
    }
    const token = await this.sendVerificationEmail(email);
    this.tempUsers.set(token, rec[1]);
    this.tempUsers.delete(rec[0]);
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: signInDto.emailOrUsername },
          { username: signInDto.emailOrUsername },
        ],
      },
    });
    if (!user) {
      throw new EntityNotFoundException('User', 'email or nickname');
    }
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new PasswordIsNotValidException();
    }
    return this.jwtService.sign({ sub: user.id });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
}

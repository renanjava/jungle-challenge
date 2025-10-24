import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppJwtService {
  constructor(private jwtService: JwtService) {}

  async signIn(sub: string, username: string): Promise<any> {
    const payload = { sub, username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

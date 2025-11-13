import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to Veltrip API',
      version: '1.0.0',
      documentation: '/api/docs',
    };
  }
}

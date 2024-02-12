import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { config } from 'dotenv';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    config();
  }
}

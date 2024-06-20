import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

type THealth = {
  success: true;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): THealth {
    return { success: true }
  }
}

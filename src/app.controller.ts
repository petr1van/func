import { Controller, Get, Query } from '@nestjs/common';
import { App } from './app';

@Controller()
export class AppController {
  constructor(public appService: App) {}

  @Get('parseWellPDSDesign')
  parseWellPDSDesign(@Query('wellRawDesign') wellRawDesign: string): string {
    return this.appService.ParseWellPDSDesign(wellRawDesign.split('|'));
  }

  getHello() {
    return 'Hello world!';
  }
}

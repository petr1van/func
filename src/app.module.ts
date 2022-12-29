import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { App } from './app';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [App],
})
export class AppModule {}

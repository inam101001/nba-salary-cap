
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapeService } from './scrape/scrape.service';
import { DatabaseService } from './database/database.service';
import { NotificationsService } from './notifications/notifications.service';
import { TasksService } from './tasks/tasks.service';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ScrapeService, DatabaseService, NotificationsService, TasksService],
})
export class AppModule {}

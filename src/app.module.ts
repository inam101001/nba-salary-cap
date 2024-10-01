import { QueryDbService } from './queries/query-db.service';
import { QueryController } from './queries/query.controller';
import { QueryService } from './queries/query.service';
import { NflController } from './nfl-players/nfl.controller';
import { NflDbService } from './nfl-players/nfl-db.service';
import { NflService } from './nfl-players/nfl.service';
import { NbaDbService } from './nba-players/nba-db.service';
import { NbaService } from './nba-players/nba.service';
import { NbaController } from './nba-players/nba.controller';

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
  controllers: [
        QueryController, 
        NflController, 
    NbaController, AppController],
  providers: [
        QueryDbService, 
        QueryService, 
        NflDbService, 
        NflService, 
        NbaDbService, 
        NbaService, AppService, ScrapeService, DatabaseService, NotificationsService, TasksService],
})
export class AppModule { }

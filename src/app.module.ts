import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { LoggerModule } from "nestjs-pino";
import { default as pinoPretty } from "pino-pretty";
import { default as env } from "@/common/env";
import { validationSchema } from "@/common/env.validation";
import { ApiController, AppController } from "@/controllers";
import { CronService } from "@/services";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env], validationSchema }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pinoPretty({ colorize: true }),
        quietReqLogger: false,
        autoLogging: false,
      },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [ApiController, AppController],
  providers: [CronService],
})
export class AppModule {}

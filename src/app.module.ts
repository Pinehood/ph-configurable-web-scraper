import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { default as pinoPretty } from "pino-pretty";
import { default as env } from "@/common/env";
import { validationSchema } from "@/common/env.validation";

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
  ],
})
export class AppModule {}

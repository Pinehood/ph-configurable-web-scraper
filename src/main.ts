import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger } from "nestjs-pino";
import { join } from "path";
import { default as env } from "@/common/env";
import { AppModule } from "@/app.module";
import { CommonConstants, SwaggerConstants } from "@/common/enums";

(async function () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.enableCors({ origin: "*" });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(Logger));

  const options = new DocumentBuilder()
    .setTitle(SwaggerConstants.TITLE)
    .setDescription(SwaggerConstants.DESCRIPTION)
    .setVersion(SwaggerConstants.VERSION)
    .build();

  if (env().SWAGGER_USE_METADATA_FILE === true) {
    const imp = await import(SwaggerConstants.METADATA);
    const def = (await imp.default()) as Record<string, any>;
    await SwaggerModule.loadPluginMetadata(async () => def);
  }
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SwaggerConstants.URL, app, document);

  app.useStaticAssets(join(__dirname, ".", "public"));
  app.setBaseViewsDir(join(__dirname, ".", "views"));
  app.setViewEngine("hbs");

  await app.listen(CommonConstants.LISTEN_PORT);
})();

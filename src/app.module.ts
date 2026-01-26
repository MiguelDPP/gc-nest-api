import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationEnvSchema } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { ErrorsModule } from './errors/errors.module';
import { PlayModule } from './play/play.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationEnvSchema,
    }),

    TypeOrmModule.forRoot({
      ssl: process.env.DB_NAME === 'prod',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.STAGE === 'dev',
    }),
    LocationModule,
    SeedModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    ErrorsModule,
    PlayModule,
    WebsocketModule,
  ],
})
export class AppModule {}

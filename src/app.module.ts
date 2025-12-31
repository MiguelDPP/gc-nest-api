import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationEnvSchema } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from './seed/seed.module';

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
  ],
})
export class AppModule {}

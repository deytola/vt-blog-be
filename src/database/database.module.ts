import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [join(__dirname, '../', '**', '*.entity.{ts,js}')],
        migrations: [join(__dirname, '../', 'migrations', '*.{ts,js}')],
        cli: {
          migrationsDir: 'src/migrations',
        },
        synchronize: true, //false in prod
        keepConnectionAlive: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

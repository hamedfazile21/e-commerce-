import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';

@Module({
  imports: [

    // 1 : Enable the .env config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2 : Connect to database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        socketPath: '/opt/lampp/var/mysql/mysql.sock', // In Linux i should use this path to know xammp
        entities: [User],
        autoLoadEntities: true,
        synchronize: true,
        charset: 'utf8mb4_unicode_ci', // to support other language like farsi
      }),
    }),

    // 3 : Import Modules
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

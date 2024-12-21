import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration, { ConfigType } from './settings/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './features/auth/auth.module'
import { ProductsModule } from './features/products/products.module'
import { JwtModule } from './base/adapters/jwt/jwt.module'
import { PostsModule } from './features/posts/posts.module'

@Module({
  imports: [
    // registration config-module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.dev', '.env.stage', '.env.prod'],
    }),
    // registration typeorm-module
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType, true>) => ({
        type: 'postgres',
        host: configService.get('db.host', { infer: true }),
        port: configService.get('db.port', { infer: true }),
        username: configService.get('db.username', { infer: true }),
        password: configService.get('db.password', { infer: true }),
        database: configService.get('db.name', { infer: true }),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    JwtModule,
    AuthModule,
    ProductsModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

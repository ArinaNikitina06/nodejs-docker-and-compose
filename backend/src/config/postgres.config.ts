import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function createTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  const requiredVars = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB', 'POSTGRES_PORT', 'POSTGRES_HOST'];
  requiredVars.forEach((v) => {
    if (!configService.get(v)) {
      throw new Error(`Environment переменная ${v} не передана`);
    }
  });

  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST') || 'localhost',
    port: Number(configService.get<number>('POSTGRES_PORT')),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  };
};
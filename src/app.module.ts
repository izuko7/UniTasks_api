import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { envSchema } from './config/env.schema.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (config) => envSchema.parse(config),
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
			},
		}),
		ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
		TerminusModule,
		PrismaModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_FILTER, useClass: AllExceptionsFilter },
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
	],
})
export class AppModule {}
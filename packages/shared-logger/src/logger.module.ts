import { DynamicModule, Module, Provider } from "@nestjs/common";
import { LoggerService } from "./logger.service";

export interface LoggerModuleOptions {
  level?: string;
  serviceName?: string;
}

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    const loggerProvider: Provider = {
      provide: LoggerService,
      useFactory: () => {
        const logger = new LoggerService({
          level: options.level,
          serviceName: options.serviceName,
        });
        return logger;
      },
    };

    return {
      module: LoggerModule,
      providers: [loggerProvider],
      exports: [loggerProvider],
    };
  }
}

import { Injectable } from "@nestjs/common";
import pino from "pino";
import { LoggerModuleOptions } from "./logger.module";

@Injectable()
export class LoggerService {
  private readonly logger: pino.Logger;
  public readonly level: string;
  public readonly serviceName: string;

  constructor(options: LoggerModuleOptions) {
    this.level = options.level;
    this.serviceName = options.serviceName;
    this.logger = pino({
      level: process.env.LOG_LEVEL,
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });
  }

  log(message: string) {
    this.logger.info(`[${this.serviceName}] ${message}`);
  }

  error(message: string, trace: string) {
    this.logger.error(`[${this.serviceName}] ${message}`, trace);
  }

  warn(message: string) {
    this.logger.warn(`[${this.serviceName}] ${message}`);
  }

  debug(message: string) {
    this.logger.debug(`[${this.serviceName}] ${message}`);
  }
}

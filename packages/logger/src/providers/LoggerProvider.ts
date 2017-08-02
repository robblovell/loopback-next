// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: @loopback/logger
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

declare function require(name:string): any;
var pino = require('pino');
var pinoHttp = require('pino-http');

import * as fs from 'fs';
import * as path from 'path';
import {Logger} from '../keys';
import {Provider} from '../../../context';
import {inject} from '../../../core';

const loggerProviderKey = Logger.System.LOGGER_PROVIDER;

/**
 * @description setup Pino HTTP logger
 */
export class SetupPinoHttpLogger implements Provider<any> {
  @inject(loggerProviderKey)
  private loggerProvider: Provider<SimpleLogger>;
  private httpLogger: any;
  constructor() {
    this.httpLogger = pinoHttp({
      logger: this.loggerProvider,
    });
    console.log('~~~ Provider of Pino HTTP logger started.');
  }
  value() {
    return this.httpLogger;
  }
}

/**
 * @description Provider of a logger
 */
export class PinoLoggerProvider implements Provider<any> {
  private logger: SimpleLogger;
  constructor() {
    this.logger = new PinoSimpleLogger();
    console.log('~~~ Provider of Pino Simple logger started.');
  }
  value() {
    return this.logger;
  }
}

/**
 * @exports SimpleLogger : interface definition for a console logger
 * @summary SimpleLoggers take a string and output to stdout
 * @example:
 * ```ts
 * export class ConsoleLogger implements SimpleLogger {
 *   ...
 * }
 * ```
 */
export interface SimpleLogger {
  /**
   * @param text
   * @returns none
   */
  error(s: string): void
  /**
   * @param text
   * @returns none
   */
  info(s: string): void
  /**
   * @param text
   * @returns none
   */
  log(s: string): void
  /**
   * @param text
   * @returns none
   */
  warn(s: string): void
}

class PinoSimpleLogger implements SimpleLogger {
  private _logger: any;
  constructor() {
    let pinoLogger = new PinoLogger(false);
    this._logger = pinoLogger.logger;
    console.log('~~~ Pino Simple logger started.');
  }
  error(s: string): void {
    this._logger.error(s);
  }
  info(s: string): void {
    this._logger.info(s);
  }
  log(s: string): void {
    this._logger.info(s);
  }
  warn(s: string): void {
    this._logger.warn(s);
  }
}

const logPath = path.join(process.cwd(), 'LoopBackNext.log');

class PinoLogger {
  private _logger: any;
  private _logToFile: boolean;
  constructor(logToFile?: boolean) {
    this._logToFile = logToFile || false;
    this._logger = pino({
      name: 'pinoLOGGER',
      safe: true,
      timestamp: pino.stdTimeFunctions.slowTime,
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res
        }
      }, this._logToFile ? fs.createWriteStream(logPath, {flags: 'a'}) :
        pino.pretty({forceColor: true}).pipe(process.stdout));
    console.log('~~~ Pino logger started.');
  }
  get logger() {
    return this._logger;
  }  
}
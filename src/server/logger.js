/******************************************Winston**********************************************/
//  Dependencies
import {createLogger, transports, format} from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `${__dirname}/logs/server.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const winstonLogger = createLogger({
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(({level, message, timestamp}) => `[${timestamp}] (${level}) ${message}`)
  ),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false
});

export default winstonLogger;

import * as winston from 'winston';
import { format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp, requestId }) => {
  return `${timestamp} [${level}] [${requestId}] ${message}`;
});

export const WinstonConfig = {
  format: combine(
    winston.format((info) => {
      const req = info.req;
      if (req && req.locals && req.locals.requestId) {
        info.requestId = req.locals.requestId;
      }
      return info;
    })(),
    timestamp(),
    customFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      dirname: './logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
    }),
  ],
};

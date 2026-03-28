import { stringify } from 'csv-stringify';
import type { Response } from 'express';

export const streamCsv = (
  res: Response,
  filename: string,
  columns: string[],
  records: Array<Record<string, unknown>>,
) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const stringifier = stringify({ header: true, columns });
  stringifier.pipe(res);
  records.forEach((record) => stringifier.write(record));
  stringifier.end();
};

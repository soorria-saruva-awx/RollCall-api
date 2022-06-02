import { RequestHandler } from 'express';
import NodeCache from 'node-cache';
import { airtable } from '../service/airtable';
import { groupBy } from 'rambda';
import dayjs from 'dayjs';
import { isString } from '../utils/is';

const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const cache = new NodeCache({ stdTTL: 1 });

export type Roll = {
  location: string;
  people: string[];
};

export type TableFields = {
  Office: string;
  Name: string;
  Time: string;
  'Date submitted': string;
  'Office day': string;
  Day: string;
};

const filterBuyLatestSubmission = (records: TableFields[]): TableFields[] => {
  const result = [] as TableFields[];
  const seen = new Set<string>();

  records.forEach(record => {
    if (seen.has(record.Name)) return;
    seen.add(record.Name);
    result.push(record);
  });

  return result;
};

type Data = Record<string, Record<string, TableFields[]>>;

const getData = async (): Promise<Data> => {
  const cached = cache.get<Data>('data');

  if (cached) return cached;

  const airtableRecords = await base
    .table<TableFields>(process.env.AIRTABLE_TABLE_NAME)
    .select({
      pageSize: 100,
      view: process.env.AIRTABLE_GROUPED_VIEW_ID,
    })
    .all();

  const records = airtableRecords.map(record => record.fields);

  const groupedByDate = groupBy(item => item['Office day'], records);
  const groupedByDateAndOffice = Object.fromEntries(
    Object.entries(groupedByDate).map(([date, records]) => [
      date,
      groupBy(record => record.Office, filterBuyLatestSubmission(records)),
    ]),
  );

  cache.set('data', groupedByDateAndOffice);

  return groupedByDateAndOffice;
};

/**
 * POST /rollcall/submit
 */
export const submitRoll: RequestHandler = async (req, res) => {};

/**
 * GET /rollcall?from=<iso date>&to=<iso date>
 */
export const getRoll: RequestHandler = async (req, res) => {
  const { from: fromStr, to: toStr } = req.query;

  if (!isString(fromStr) || !isString(toStr)) {
    return res
      .status(400)
      .json({ error: "'from' and 'to' query params must be provided" });
  }

  const from = dayjs(fromStr).startOf('day');
  const to = dayjs(toStr).startOf('day');

  if (!from.isValid() || !to.isValid()) {
    return res
      .status(400)
      .json({ error: "'from' and 'to' query params must be iso format dates" });
  }

  const data = await getData();

  const result = {} as Data;

  for (let day = from; day.isBefore(to); day = day.add(1, 'day')) {
    const dayKey = day.format('YYYY-MM-DD');
    result[dayKey] = data[dayKey] || {};
  }

  const toKey = to.format('YYYY-MM-DD');
  result[toKey] = data[toKey] || {};

  res.json(result);
};

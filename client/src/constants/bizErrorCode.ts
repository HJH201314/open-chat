/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED, DO NOT MODIFY.                   ##
 * ---------------------------------------------------------------
 */

export type BizErrorType = {
  bizCode: number;
  httpCode: number;
  msg: string;
};

export type BizErrorMapType = {
  name: string;
  bizCode: number;
  httpCode: number;
  msg: string;
};

export const BizErrNoPermission: BizErrorType = {
  httpCode: 400,
  bizCode: 10001,
  msg: 'no permission',
};
export const BizErrNoRecord: BizErrorType = {
  httpCode: 400,
  bizCode: 10002,
  msg: 'no record',
};
export const BizErrOutdated: BizErrorType = {
  httpCode: 400,
  bizCode: 10003,
  msg: 'outdated',
};

export const BIZ_ERROR: Record<string, BizErrorType> = {
  ErrNoPermission: BizErrNoPermission,
  ErrNoRecord: BizErrNoRecord,
  ErrOutdated: BizErrOutdated,
};

export const BIZ_ERROR_MAP = Object.entries(BIZ_ERROR).reduce(
  (acc, [name, { bizCode, httpCode, msg }]) => {
    acc[bizCode] = { name, bizCode, httpCode, msg };
    return acc;
  },
  {} as Record<number, BizErrorMapType>
);

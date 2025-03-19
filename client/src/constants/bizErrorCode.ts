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

export const BIZ_ERROR: Record<string, BizErrorType> = {
  ErrNoPermission: {
    httpCode: 400,
    bizCode: 10001,
    msg: 'no permission',
  },
};

export const BIZ_ERROR_MAP = Object.entries(BIZ_ERROR).reduce(
  (acc, [name, { bizCode, httpCode, msg }]) => {
    acc[bizCode] = { name, bizCode, httpCode, msg };
    return acc;
  },
  {} as Record<number, BizErrorMapType>
);

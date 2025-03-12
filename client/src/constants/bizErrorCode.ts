/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED, DO NOT MODIFY.                   ##
 * ---------------------------------------------------------------
 */

export type BizErrorType = {
  code: number;
  msg: string;
};

export type BizErrorMapType = {
  name: string;
  code: number;
  msg: string;
};

export const BIZ_ERROR: Record<string, BizErrorType> = {
  ErrNoPermission: {
    code: 10001,
    msg: 'no permission',
  },
};

export const BIZ_ERROR_MAP = Object.entries(BIZ_ERROR).reduce(
  (acc, [name, { code, msg }]) => {
    acc[code] = { name, code, msg };
    return acc;
  },
  {} as Record<number, BizErrorMapType>
);

/* eslint-disable @typescript-eslint/no-explicit-any */
import jsMd5 from "js-md5";

export const createSign = (
  params: Record<string, any>,
  key: string
): string => {
  const sortedParams = params
    ? Object.keys(params)
        .filter((key) => params[key] !== "")
        .sort()
        .reduce((result: any, key) => {
          result[key] = params[key];
          return result;
        }, {})
    : null;

  const stringA = sortedParams
    ? Object.entries(sortedParams)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}=${JSON.stringify(value)}`;
          } else {
            return `${key}=${value}`;
          }
        })
        .join("&")
    : null;

  const stringSignTemp = String(
    (stringA && stringA + "&key=" + key) || "key=" + key
  );

  const signValue = jsMd5(stringSignTemp).toUpperCase();

  return signValue;
};

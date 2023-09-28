/* eslint-disable @typescript-eslint/no-explicit-any */
import jsMd5 from "js-md5";
function removeFileTypesFromJSON(json: any): any {
  if (typeof json === "object" && json !== null) {
    if (json instanceof File) {
      return undefined;
    }

    if (Array.isArray(json)) {
      return json.map((item) => removeFileTypesFromJSON(item));
    }

    const result: any = {};

    for (const key in json) {
      const value = json[key];
      const newValue = removeFileTypesFromJSON(value);

      if (typeof newValue !== "undefined") {
        result[key] = newValue;
      }
    }

    return result;
  }

  return json;
}

export const createSign = (
  params: Record<string, any>,
  key: string
): string => {
  const data = removeFileTypesFromJSON(params);
  const sortedParams = data
    ? Object.keys(data)
        .filter((key) => data[key] !== "")
        .sort()
        .reduce((result: any, key) => {
          result[key] = data[key];
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

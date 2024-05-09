import { getSQLValue } from "./insert";

export const getUPDATEValues = (object: object) => {
  const entries = Object.entries(object) as [string, any][]
  const values = entries.map(([key, value]) => `${key} = ${getSQLValue(value)}`).join(",\n        ")
  return values;
}
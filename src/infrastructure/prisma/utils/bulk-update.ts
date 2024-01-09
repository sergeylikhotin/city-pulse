// https://gist.github.com/aalin/ea23b786e3d55329f6257c0f6576418b

import { Prisma, PrismaClient } from "@prisma/client";

type ConvertTupleTypes<T extends unknown[], ConvertTo> = T extends [
    infer _First,
    ...infer Rest,
  ]
  ? [ConvertTo, ...ConvertTupleTypes<Rest, ConvertTo>]
  : [];

type FieldsType<T extends unknown[]> = T extends [infer _First, ...infer Rest]
  ? ConvertTupleTypes<Rest, string>
  : [];

export default function bulkUpdate<T extends unknown[]>(
  prisma: PrismaClient,
  tableName: Prisma.ModelName,
  fields: FieldsType<T>,
  values: T[]
) {
  const setSql = fields
    .map((field) => `"${field}" = "t"."${field}"`)
    .join(", ");
  const fieldsSql = fields.map((f) => `"${f}"`).join(", ");

  let paramIndex = 0;
  const valuesSql = values
    .map((row) => `(${row.map(() => `\$${++paramIndex}`)})`)
    .join(",");

  const sql = `UPDATE "${tableName}" SET ${setSql} FROM (VALUES ${valuesSql}) AS t("id", ${fieldsSql}) WHERE "${tableName}"."id" = "t"."id"`;

  return prisma.$executeRawUnsafe(sql, ...values.flat());
}

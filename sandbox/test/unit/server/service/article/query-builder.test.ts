import { asc, desc, eq } from "drizzle-orm"
import { describe, expect, test } from "vitest"
import { article } from "../../../../../server/db/schema"
import {
  buildOrderSQL,
  buildWhereSQL
} from "../../../../../server/repository/article/query-builder"

describe("buildWhereSQL", () => {
  test("条件が指定されていない場合はundefinedを返す", () => {
    expect(buildWhereSQL()).toBeUndefined()
  })

  test("conditionsが空配列の場合はundefinedを返す", () => {
    expect(buildWhereSQL({ conditions: [] })).toBeUndefined()
  })

  test("サポートされているカラムのeq式を生成する", () => {
    const result = buildWhereSQL({
      conditions: [{ column: "publisherId", operator: "eq", value: 1 }]
    })
    expect(result).toEqual(eq(article.publisherId, 1))
  })
})

describe("buildOrderSQL", () => {
  test("orderByが指定されていない場合はundefinedを返す", () => {
    expect(buildOrderSQL({})).toBeUndefined()
  })

  test("サポートされているカラムのasc式を生成する", () => {
    expect(
      buildOrderSQL({ orderBy: [{ column: "publishedAt", direction: "asc" }] })
    ).toEqual([asc(article.publishedAt)])
  })

  test("サポートされているカラムのdesc式を生成する", () => {
    expect(
      buildOrderSQL({ orderBy: [{ column: "publishedAt", direction: "desc" }] })
    ).toEqual([desc(article.publishedAt)])
  })

  test("複数のorder式を生成する", () => {
    expect(
      buildOrderSQL({
        orderBy: [
          { column: "publishedAt", direction: "desc" },
          { column: "title", direction: "asc" }
        ]
      })
    ).toEqual([desc(article.publishedAt), asc(article.title)])
  })
})

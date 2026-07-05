import { describe, expect, test } from "vitest"
import { requestBodySchema } from "../../../../../server/api/article/schema/request-body-schema"

describe("requestBodySchema", () => {
  test("空オブジェクトを受け入れる", () => {
    expect(() => {
      return requestBodySchema.parse({})
    }).not.toThrow()
  })

  test("有効なボディを受け入れる", () => {
    expect(() => {
      return requestBodySchema.parse({ publisherId: 1, limit: 10, offset: 0 })
    }).not.toThrow()
  })

  test("publisherId が正の整数でないとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ publisherId: 0 })
    }).toThrow()
  })

  test("publisherId が小数のとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ publisherId: 1.5 })
    }).toThrow()
  })

  test("limit が 0 のとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ limit: 0 })
    }).toThrow()
  })

  test("limit が負数のとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ limit: -1 })
    }).toThrow()
  })

  test("offset が負数のとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ offset: -1 })
    }).toThrow()
  })

  test("limit が小数のとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ limit: 1.5 })
    }).toThrow()
  })

  test("limit を省略したとき既定値15になる", () => {
    expect(requestBodySchema.parse({}).limit).toBe(15)
  })

  test("limit が15を超えるとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ limit: 16 })
    }).toThrow()
  })

  test("offset が小数のとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ offset: 1.5 })
    }).toThrow()
  })

  test("offset が 0 のとき受け入れる", () => {
    expect(() => {
      return requestBodySchema.parse({ offset: 0 })
    }).not.toThrow()
  })

  test("offset が10000を超えるとき拒否する", () => {
    expect(() => {
      return requestBodySchema.parse({ offset: 10001 })
    }).toThrow()
  })

  test("offset が10000のとき受け入れる", () => {
    expect(() => {
      return requestBodySchema.parse({ offset: 10000 })
    }).not.toThrow()
  })
})

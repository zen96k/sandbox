import { describe, expect, test, vi } from "vitest"
import type { PublisherType } from "../../../../../server/repository/article"
import { generateArticleService } from "../../../../../server/service/article"

describe("generateArticleService", () => {
  const publishers: PublisherType[] = [{ id: 1, name: "Example Publisher" }]

  test("limitとoffsetをリポジトリに渡す", async () => {
    const repository = {
      readArticlesByPublisherId: vi.fn().mockResolvedValue([]),
      countArticlesByPublisherId: vi.fn(),
      readPublishers: vi.fn()
    }
    const service = generateArticleService({ repository })

    await service.readArticlesByPublisherId({ limit: 10, offset: 20 })

    expect(repository.readArticlesByPublisherId).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10, offset: 20 })
    )
  })

  test("publisherIdをそのままリポジトリに渡す", async () => {
    const repository = {
      readArticlesByPublisherId: vi.fn().mockResolvedValue([]),
      countArticlesByPublisherId: vi.fn(),
      readPublishers: vi.fn()
    }
    const service = generateArticleService({ repository })

    await service.readArticlesByPublisherId({ publisherId: 1 })

    expect(repository.readArticlesByPublisherId).toHaveBeenCalledWith(
      expect.objectContaining({ publisherId: 1 })
    )
  })

  test("countArticlesByPublisherIdをリポジトリに委譲して件数を返す", async () => {
    const repository = {
      readArticlesByPublisherId: vi.fn(),
      countArticlesByPublisherId: vi.fn().mockResolvedValue(3),
      readPublishers: vi.fn()
    }
    const service = generateArticleService({ repository })

    await expect(service.countArticlesByPublisherId({})).resolves.toBe(3)
  })

  test("readPublishersをリポジトリに委譲する", async () => {
    const repository = {
      readArticlesByPublisherId: vi.fn(),
      countArticlesByPublisherId: vi.fn(),
      readPublishers: vi.fn().mockResolvedValue(publishers)
    }
    const service = generateArticleService({ repository })

    await expect(service.readPublishers()).resolves.toEqual(publishers)
  })
})

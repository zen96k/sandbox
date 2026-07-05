import { getBrowser, setup, url, waitForHydration } from "@nuxt/test-utils/e2e"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Page } from "playwright-core"
import { afterAll, afterEach, beforeEach, describe, expect, test } from "vitest"
import { article, publisher } from "../../../../../server/db/schema"

// desktop (limit=15) で3ページ分確保するため 46 件
const ARTICLES = Array.from({ length: 46 }, (_, i) => {
  return {
    id: i + 1,
    title: `記事 ${i + 1}`,
    publisherId: i % 2 === 0 ? 2 : 1,
    url: `https://example.com/${i + 1}`,
    author: "author",
    publishedAt: new Date("2026-01-01")
  }
})

const PUBLISHERS = [
  { id: 1, name: "Qiita", url: "https://qiita.com/popular-items/feed.atom" },
  { id: 2, name: "Zenn", url: "https://zenn.dev/feed" }
]

const tmpDirectoryName = await mkdtemp(join(tmpdir(), "browser-history-e2e-"))
const dbFileName = `file:${join(tmpDirectoryName, "test.sqlite")}`

const db = drizzle(dbFileName)
await migrate(db, {
  migrationsFolder: fileURLToPath(
    new URL("../../../../../drizzle", import.meta.url)
  )
})
await db.insert(publisher).values(PUBLISHERS)
await db.insert(article).values(ARTICLES)

afterAll(async () => {
  await rm(tmpDirectoryName, { recursive: true, force: true })
})

await setup({
  rootDir: fileURLToPath(new URL("../../../../..", import.meta.url)),
  browser: true,
  env: { DB_FILE_NAME: dbFileName }
})

const createPage = async (): Promise<Page> => {
  const page = await (await getBrowser()).newPage()

  return page
}

describe("記事一覧 - ブラウザ履歴", () => {
  let page: Page

  beforeEach(async () => {
    page = await createPage()
  })

  afterEach(async () => {
    await page.close()
  })

  test("ページ送りが履歴に積まれる", async () => {
    await page.goto(url("/article"))
    await waitForHydration(page, url("/article"), "hydration")

    await page.locator('[aria-label="Page 2"]').first().click()
    await page.waitForURL(/page=2/)

    await page.locator('[aria-label="Page 3"]').first().click()
    await page.waitForURL(/page=3/)

    await page.goBack()
    await page.waitForURL(/page=2/)
    expect(page.url()).toContain("page=2")

    await page.goForward()
    await page.waitForURL(/page=3/)
    expect(page.url()).toContain("page=3")
  })

  test("配信元フィルターが履歴に積まれる", async () => {
    await page.goto(url("/article"))
    await waitForHydration(page, url("/article"), "hydration")

    await page.getByRole("button", { name: "Zenn" }).click()
    await page.waitForURL(/publisher=2/)

    await page.goBack()
    await page.waitForURL((u) => {
      return !u.toString().includes("publisher")
    })
    expect(page.url()).not.toContain("publisher")
  })

  test("配信元切り替え時にページが 1 にリセットされる", async () => {
    await page.goto(url("/article?page=3"))
    await waitForHydration(page, url("/article?page=3"), "hydration")

    await page.getByRole("button", { name: "Zenn" }).click()
    await page.waitForURL(/publisher=2/)
    expect(page.url()).not.toContain("page=")

    await page.goBack()
    await page.waitForURL(/page=3/)
    expect(page.url()).toContain("page=3")
  })

  test("URL直接アクセスが正しく表示される", async () => {
    await page.goto(url("/article?page=2&publisher=2"))
    await page.waitForLoadState("networkidle")

    expect(page.url()).toContain("page=2")
    expect(page.url()).toContain("publisher=2")
    expect(
      await page.getByRole("heading", { name: "記事一覧" }).isVisible()
    ).toBe(true)
  })
})

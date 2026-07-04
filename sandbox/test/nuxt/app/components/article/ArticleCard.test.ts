import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, test } from "vitest"
import ArticleCard from "~/components/article/ArticleCard.vue"

const mockArticle = {
  id: 1,
  publisherName: "Zenn",
  title: "Nuxt 4 のテスト入門",
  url: "https://example.com/article/1",
  author: "test-author",
  publishedAt: new Date("2026-01-15T10:00:00")
}

describe("ArticleCard", () => {
  test("記事タイトルが表示される", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.text()).toContain("Nuxt 4 のテスト入門")
  })

  test("publisher 名が表示される", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.text()).toContain("Zenn")
  })

  test("author 名が表示される", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.text()).toContain("test-author")
  })

  test("公開日が表示される", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.text()).toContain("2026-01-15")
  })

  test("リンクの href が記事 URL になっている", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.find("a").attributes("href")).toBe(
      "https://example.com/article/1"
    )
  })

  test("リンクが target=_blank で開く", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.find("a").attributes("target")).toBe("_blank")
  })

  test("リンクに rel=noopener noreferrer が設定されている", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.find("a").attributes("rel")).toBe("noopener noreferrer")
  })

  test("summaryStatus が completed かつ summary がある場合、要約が表示される", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: {
        article: {
          ...mockArticle,
          summary: "この記事はNuxt 4のテストについて解説しています。",
          summaryStatus: "completed"
        }
      }
    })
    expect(wrapper.text()).toContain(
      "この記事はNuxt 4のテストについて解説しています。"
    )
  })

  test.each(["pending", "processing", "failed", null])(
    "summaryStatus が %s の場合、要約は表示されない",
    async (summaryStatus) => {
      const wrapper = await mountSuspended(ArticleCard, {
        props: {
          article: {
            ...mockArticle,
            summary: "隠れているはずの要約",
            summaryStatus
          }
        }
      })
      expect(wrapper.text()).not.toContain("隠れているはずの要約")
    }
  )

  test("summary が null の場合、要約は表示されない", async () => {
    const wrapper = await mountSuspended(ArticleCard, {
      props: {
        article: { ...mockArticle, summary: null, summaryStatus: "completed" }
      }
    })
    expect(wrapper.find("p").exists()).toBe(false)
  })
})

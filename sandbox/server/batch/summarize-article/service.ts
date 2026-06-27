import type { summarizeArticle as SummarizeArticleType } from "./gemini"
import type { generateArticleSummaryRepository } from "./repository"
import { extractText, fetchHtml, generateContentHash } from "./scraper"

const processingTimeoutSeconds = 3600

type ArticleSummaryRepositoryType = ReturnType<
  typeof generateArticleSummaryRepository
>

type PendingArticleType = Awaited<
  ReturnType<ArticleSummaryRepositoryType["readPendingArticles"]>
>[number]

export const generateArticleSummaryService = ({
  repository,
  summarizeArticle
}: {
  repository: ArticleSummaryRepositoryType
  summarizeArticle: typeof SummarizeArticleType
}) => {
  return {
    readPendingArticles: async ({ limit }: { limit?: number } = {}) => {
      const timeoutAt = new Date(Date.now() - processingTimeoutSeconds * 1000)

      return await repository.readPendingArticles({ timeoutAt, limit })
    },

    summarizeArticle: async ({ article }: { article: PendingArticleType }) => {
      await repository.updateArticleSummaryStatusProcessing({
        articleId: article.id
      })

      const html = await fetchHtml({ url: article.url })
      const text = extractText({ html, url: article.url })
      const contentHash = generateContentHash({ text })

      if (article.summary && article.contentHash === contentHash) {
        await repository.updateArticleSummaryStatusSkipped({
          articleId: article.id
        })
        console.log(
          `${article.title} は本文に変更がないため要約をスキップしました`
        )
      } else {
        const summary = await summarizeArticle({ title: article.title, text })
        await repository.updateArticleSummaryStatusCompleted({
          articleId: article.id,
          contentHash,
          summary
        })
        console.log(`${article.title} の要約を更新しました`)
      }
    },

    updateArticleSummaryStatusFailed: async ({
      articleId,
      error
    }: {
      articleId: number
      error: unknown
    }) => {
      return await repository.updateArticleSummaryStatusFailed({
        articleId,
        error
      })
    }
  }
}

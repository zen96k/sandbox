import { count, desc, eq } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import type * as schema from "../../db/schema"
import { article, articleSummary, publisher } from "../../db/schema"

export type ArticleType = {
  id: number
  title: string
  url: string
  author: string
  publishedAt: Date
  publisherName: string
  summary: string | null
  summaryStatus: string | null
}

export type PublisherType = { id: number; name: string }

export type ArticleQueryOptionType = {
  publisherId?: number
  limit?: number
  offset?: number
}

export const generateArticleRepository = ({
  db
}: {
  db: LibSQLDatabase<typeof schema>
}) => {
  return {
    readArticlesByPublisherId: async ({
      publisherId,
      limit,
      offset
    }: ArticleQueryOptionType = {}): Promise<ArticleType[]> => {
      let query = db
        .select({
          id: article.id,
          title: article.title,
          url: article.url,
          author: article.author,
          publishedAt: article.publishedAt,
          publisherName: publisher.name,
          summary: articleSummary.summary,
          summaryStatus: articleSummary.status
        })
        .from(article)
        .innerJoin(publisher, eq(article.publisherId, publisher.id))
        .leftJoin(articleSummary, eq(article.id, articleSummary.articleId))
        .$dynamic()
        .orderBy(desc(article.publishedAt))

      if (publisherId) {
        query = query.where(eq(article.publisherId, publisherId))
      }
      if (limit) {
        query = query.limit(limit)
      }
      if (offset) {
        query = query.offset(offset)
      }

      return await query
    },

    countArticlesByPublisherId: async ({
      publisherId
    }: Pick<ArticleQueryOptionType, "publisherId"> = {}): Promise<number> => {
      let query = db
        .select({ count: count() })
        .from(article)
        .innerJoin(publisher, eq(article.publisherId, publisher.id))
        .$dynamic()

      if (publisherId) {
        query = query.where(eq(article.publisherId, publisherId))
      }

      const [{ count: total }] = (await query) as [{ count: number }]

      return total
    },

    readPublishers: async (): Promise<PublisherType[]> => {
      return await db
        .selectDistinct({ id: publisher.id, name: publisher.name })
        .from(article)
        .innerJoin(publisher, eq(article.publisherId, publisher.id))
        .orderBy(publisher.name)
    }
  }
}

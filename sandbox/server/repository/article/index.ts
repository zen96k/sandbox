import { count, eq } from "drizzle-orm"
import type { LibSQLDatabase } from "drizzle-orm/libsql"
import type * as schema from "../../db/schema"
import { article, articleSummary, publisher } from "../../db/schema"
import {
  type WhereConditionType,
  buildOrderSQL,
  buildWhereSQL
} from "./query-builder"

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

const buildWhereConditions = ({
  publisherId
}: {
  publisherId?: number
}): WhereConditionType[] | undefined => {
  return publisherId
    ? [{ column: "publisherId", operator: "eq", value: publisherId }]
    : undefined
}

export const generateArticleRepository = ({
  db
}: {
  db: LibSQLDatabase<typeof schema>
}) => {
  return {
    readArticles: async ({
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

      const whereSQL = buildWhereSQL({
        conditions: buildWhereConditions({ publisherId })
      })
      const orderSQL = buildOrderSQL({
        orderBy: [{ column: "publishedAt", direction: "desc" }]
      })

      if (whereSQL) {
        query = query.where(whereSQL)
      }
      if (orderSQL) {
        query = query.orderBy(...orderSQL)
      }
      if (limit) {
        query = query.limit(limit)
      }
      if (offset) {
        query = query.offset(offset)
      }

      return await query
    },

    countArticles: async ({
      publisherId
    }: Pick<ArticleQueryOptionType, "publisherId"> = {}): Promise<number> => {
      let query = db
        .select({ count: count() })
        .from(article)
        .innerJoin(publisher, eq(article.publisherId, publisher.id))
        .$dynamic()

      const whereSQL = buildWhereSQL({
        conditions: buildWhereConditions({ publisherId })
      })
      if (whereSQL) {
        query = query.where(whereSQL)
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

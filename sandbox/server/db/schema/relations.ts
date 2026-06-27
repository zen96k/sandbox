import { relations } from "drizzle-orm"
import { article } from "./article"
import { articleSummary } from "./article-summary"
import { publisher } from "./publisher"

export const publisherRelations = relations(publisher, ({ many }) => {
  return { article: many(article) }
})

export const articleRelations = relations(article, ({ one }) => {
  return {
    publisher: one(publisher, {
      fields: [article.publisherId],
      references: [publisher.id]
    }),
    summary: one(articleSummary, {
      fields: [article.id],
      references: [articleSummary.articleId]
    })
  }
})

export const articleSummaryRelations = relations(articleSummary, ({ one }) => {
  return {
    article: one(article, {
      fields: [articleSummary.articleId],
      references: [article.id]
    })
  }
})

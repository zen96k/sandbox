import { relations } from "drizzle-orm"
import { article } from "./article"
import { publisher } from "./publisher"

export const publisherRelations = relations(publisher, ({ many }) => {
  return { article: many(article) }
})

export const articleRelations = relations(article, ({ one }) => {
  return {
    publisher: one(publisher, {
      fields: [article.publisherId],
      references: [publisher.id]
    })
  }
})

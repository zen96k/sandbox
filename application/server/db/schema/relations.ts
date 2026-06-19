import { relations } from "drizzle-orm"
import { article } from "./article"
import { articleArticleLabel } from "./article-article-label"
import { articleLabel } from "./article-label"
import { publisher } from "./publisher"

export const publisherRelations = relations(publisher, ({ many }) => ({
  article: many(article)
}))

export const articleRelations = relations(article, ({ one, many }) => ({
  publisher: one(publisher, {
    fields: [article.publisherId],
    references: [publisher.id]
  }),
  articleArticleLabel: many(articleArticleLabel)
}))

export const articleLabelRelations = relations(articleLabel, ({ many }) => ({
  articleArticleLabel: many(articleArticleLabel)
}))

export const articleArticleLabelRelations = relations(
  articleArticleLabel,
  ({ one }) => ({
    article: one(article, {
      fields: [articleArticleLabel.articleId],
      references: [article.id]
    }),
    articleLabel: one(articleLabel, {
      fields: [articleArticleLabel.articleLabelId],
      references: [articleLabel.id]
    })
  })
)

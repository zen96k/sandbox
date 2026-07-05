import type {
  ArticleQueryOptionType,
  ArticleType,
  PublisherType
} from "../../repository/article"

export type ArticleRepositoryType = {
  readArticlesByPublisherId(
    option?: ArticleQueryOptionType
  ): Promise<ArticleType[]>
  countArticlesByPublisherId(
    option?: Pick<ArticleQueryOptionType, "publisherId">
  ): Promise<number>
  readPublishers(): Promise<PublisherType[]>
}

export const generateArticleService = ({
  repository
}: {
  repository: ArticleRepositoryType
}) => {
  return {
    readArticlesByPublisherId: async (
      option: ArticleQueryOptionType = {}
    ): Promise<ArticleType[]> => {
      return await repository.readArticlesByPublisherId(option)
    },

    countArticlesByPublisherId: async ({
      publisherId
    }: Pick<ArticleQueryOptionType, "publisherId"> = {}): Promise<number> => {
      return await repository.countArticlesByPublisherId({ publisherId })
    },

    readPublishers: async (): Promise<PublisherType[]> => {
      return await repository.readPublishers()
    }
  }
}

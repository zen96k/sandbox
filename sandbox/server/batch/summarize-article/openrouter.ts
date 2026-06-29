import { OpenRouter } from "@openrouter/sdk"
import "dotenv/config"

const openrouterApiKey = process.env.OPENROUTER_API_KEY
const openrouterModel = "openrouter/free"
const maxContentCharacterLength = 30_000

if (!openrouterApiKey) {
  throw new Error("OPENROUTER_API_KEY が未設定です")
}

const client = new OpenRouter({ apiKey: openrouterApiKey })

export const summarizeArticle = async ({
  title,
  text
}: {
  title: string
  text: string
}) => {
  const sourceText = text.slice(0, maxContentCharacterLength)
  const prompt = [
    "次の記事を日本語で要約してください。",
    '{"summary": ["起の内容", "承の内容", "転の内容", "結の内容"]} の形式のJSONオブジェクトのみを返してください。',
    "summaryは起承転結に対応した4つの文字列の配列にしてください。",
    "起: 記事の背景・課題・導入",
    "承: 本論の展開・詳細",
    "転: 気づき・転換点・比較・補足",
    "結: 結論・まとめ・今後の展望",
    "記事に書かれていない推測は含めないでください。",
    "",
    `タイトル: ${title}`,
    "",
    sourceText
  ].join("\n")

  const response = await client.chat.send({
    chatRequest: {
      model: openrouterModel,
      messages: [{ role: "user", content: prompt }],
      responseFormat: { type: "json_object" }
    }
  })

  const content = response.choices[0]?.message?.content
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenRouter の要約が空です")
  }

  const parsed: unknown = JSON.parse(content.trim())
  const summary =
    typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)["summary"]
      : undefined

  if (
    !Array.isArray(summary) ||
    summary.some((item) => {
      return typeof item !== "string"
    })
  ) {
    throw new Error("OpenRouter の要約が期待する JSON 形式ではありません")
  }

  return JSON.stringify(summary)
}

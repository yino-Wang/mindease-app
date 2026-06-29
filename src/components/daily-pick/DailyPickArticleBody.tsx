type DailyPickArticleBodyProps = {
  contentHtml?: string | null;
  contentText?: string | null;
  excerpt: string;
};

/** Split plain-text fallback into paragraphs and numbered section headings. */
function splitPlainTextBlocks(text: string): Array<{ type: "p" | "h3"; text: string }> {
  const chunks = text.split(/\n{2,}/g).map((s) => s.trim()).filter(Boolean);
  const blocks: Array<{ type: "p" | "h3"; text: string }> = [];

  for (const chunk of chunks) {
    const lines = chunk.split(/\n/).map((s) => s.trim()).filter(Boolean);
    for (const line of lines) {
      const headingMatch = line.match(/^(\d{1,2}\.\s+.+)$/);
      if (headingMatch && line.length < 120) {
        blocks.push({ type: "h3", text: headingMatch[1] });
      } else {
        blocks.push({ type: "p", text: line });
      }
    }
  }

  return blocks;
}

export function DailyPickArticleBody({
  contentHtml,
  contentText,
  excerpt,
}: DailyPickArticleBodyProps) {
  const html = contentHtml?.trim();
  if (html) {
    return (
      <div
        className="article-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const text = contentText?.trim();
  if (text) {
    const blocks = splitPlainTextBlocks(text);
    return (
      <div className="article-prose">
        {blocks.map((block, idx) =>
          block.type === "h3" ? (
            <h3 key={idx}>{block.text}</h3>
          ) : (
            <p key={idx}>{block.text}</p>
          )
        )}
      </div>
    );
  }

  return <p className="article-prose">{excerpt}</p>;
}

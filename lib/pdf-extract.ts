import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise

  const pageTexts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group text items by their y-coordinate to reconstruct lines
    const lineMap = new Map<number, { x: number; str: string }[]>()

    for (const item of content.items) {
      if (!("str" in item) || !item.str.trim()) continue

      // Round y to nearest integer to group items on the same visual line
      const y = Math.round((item as { transform: number[] }).transform[5])
      const x = (item as { transform: number[] }).transform[4]

      if (!lineMap.has(y)) {
        lineMap.set(y, [])
      }
      lineMap.get(y)!.push({ x, str: item.str })
    }

    // Sort lines by y descending (PDF coordinates go bottom-up)
    const sortedYs = [...lineMap.keys()].sort((a, b) => b - a)

    const lines: string[] = []
    for (const y of sortedYs) {
      const items = lineMap.get(y)!
      // Sort items left-to-right by x coordinate
      items.sort((a, b) => a.x - b.x)

      // Join items with spacing -- use tab for large gaps (column separators)
      let line = ""
      for (let j = 0; j < items.length; j++) {
        if (j > 0) {
          const gap = items[j].x - (items[j - 1].x + items[j - 1].str.length * 4)
          line += gap > 30 ? "\t" : " "
        }
        line += items[j].str
      }
      lines.push(line.trim())
    }

    pageTexts.push(lines.join("\n"))
  }

  return pageTexts.join("\n\n")
}

export async function getPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  return pdf.numPages
}

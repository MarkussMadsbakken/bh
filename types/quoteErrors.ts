export type QuoteError = {
    type: "quote_not_found" | "quote_not_created" | "quote_not_updated" | "quote_not_deleted",
    reason: string
}
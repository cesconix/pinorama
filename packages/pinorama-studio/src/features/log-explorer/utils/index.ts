import type { SearchParams } from "@orama/orama"
import type { BaseOramaPinorama } from "pinorama-types"

const createBasePayload = <T extends BaseOramaPinorama>(): SearchParams<T> => ({
  limit: 10_000,
  sortBy: { property: "_pinorama.createdAt" }
})

const withSearchText =
  <T extends BaseOramaPinorama>(searchText: string) =>
  (payload: SearchParams<T>): SearchParams<T> => {
    return { ...payload, term: searchText }
  }

const withSearchFilters =
  <T extends BaseOramaPinorama>(
    searchFilters: SearchParams<BaseOramaPinorama>["where"]
  ) =>
  (payload: SearchParams<T>): SearchParams<T> => {
    const where: SearchParams<T>["where"] = payload.where || {}
    return { ...payload, where: { ...where, ...searchFilters } }
  }

const withCursor =
  <T extends BaseOramaPinorama>(cursor: number) =>
  (payload: SearchParams<T>): SearchParams<T> => {
    const where: SearchParams<T>["where"] = payload.where || {}
    return {
      ...payload,
      where: { ...where, "_pinorama.createdAt": { gt: cursor || 0 } }
    }
  }

export const buildPayload = <T extends BaseOramaPinorama>(
  searchText?: string,
  searchFilters?: SearchParams<T>["where"],
  cursor?: number
) => {
  let payload = createBasePayload()

  if (searchText) {
    const addSearchText = withSearchText(searchText)
    payload = addSearchText(payload)
  }

  if (searchFilters) {
    const addSearchFilters = withSearchFilters(searchFilters)
    payload = addSearchFilters(payload)
  }

  if (cursor) {
    const addCursor = withCursor(cursor)
    payload = addCursor(payload)
  }

  return payload
}

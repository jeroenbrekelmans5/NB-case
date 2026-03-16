import type { ArrayFilterKey } from '~/types'

export const EXACT_MATCH_FILTERS: ArrayFilterKey[] = ['city', 'department']
export const RANGE_FILTERS: ArrayFilterKey[] = ['hours', 'salary']

export const ARRAY_FILTERS: ArrayFilterKey[] = [...EXACT_MATCH_FILTERS, ...RANGE_FILTERS]

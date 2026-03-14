import type { H3Event } from 'h3'
import type { Filters } from '~/types'

/**
 * Parses a query parameter value into an array of strings
 */
const parseArrayParam = (value: string | string[] | undefined): string[] => {
	if (!value) return []
	if (Array.isArray(value)) return value
	return value.split(',').filter(Boolean)
}

/**
 * Extracts and parses filters from H3 query parameters
 */
export const parseFiltersFromQuery = (event: H3Event): Filters => {
	const query = getQuery(event)

	return {
		search: typeof query.search === 'string' ? query.search : undefined,
		city: parseArrayParam(query.city as string[]),
		department: parseArrayParam(query.department as string[]),
		hours: parseArrayParam(query.hours as string[]),
		salary: parseArrayParam(query.salary as string[]),
	}
}

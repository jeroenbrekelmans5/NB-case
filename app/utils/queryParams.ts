import type { LocationQuery } from 'vue-router'

/**
 * Parses a query parameter into an array of strings
 */
export const parseQueryParam = (query: LocationQuery, key: string): string[] => {
	const value = query[key]
	if (!value) return []
	return typeof value === 'string' ? value.split(',') : []
}

/**
 * Serializes filters into query parameters
 */
export const serializeFilters = (
	filters: Record<string, string | string[] | undefined>,
	arrayKeys: string[],
): Record<string, string> => {
	const query: Record<string, string> = {}

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return

		if (arrayKeys.includes(key) && Array.isArray(value)) {
			if (value.length > 0) {
				query[key] = value.join(',')
			}
		} else if (typeof value === 'string') {
			query[key] = value
		}
	})

	return query
}

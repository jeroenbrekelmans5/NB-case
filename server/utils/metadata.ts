import type { Offer } from '~/types'

/**
 * Extracts unique values from offers for a given field
 */
export const getUniqueValues = (offers: Offer[], field: keyof Offer): string[] => {
	const values = new Set<string>()

	offers.forEach((offer) => {
		const value = offer[field]
		if (typeof value === 'string') {
			values.add(value)
		}
	})

	return Array.from(values).sort()
}

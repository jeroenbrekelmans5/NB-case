import type { Offer, RangeBucket } from '~/types'
import { rangeOverlaps } from './buckets'

/**
 * Filters offers by search term (case-insensitive title match)
 */
export const filterBySearch = (offers: Offer[], searchTerm: string | undefined): Offer[] => {
	if (!searchTerm) return offers

	const searchLower = searchTerm.toLowerCase()
	return offers.filter((offer) => offer.title.toLowerCase().includes(searchLower))
}

/**
 * Filters offers by exact match on a field
 */
export const filterByExactMatch = (
	offers: Offer[],
	field: keyof Offer,
	values: string[] | undefined,
): Offer[] => {
	if (!values || values.length === 0) return offers

	return offers.filter((offer) => {
		const offerValue = offer[field]
		return typeof offerValue === 'string' && values.includes(offerValue)
	})
}

/**
 * Filters offers by range buckets (e.g., salary, hours)
 */
export const filterByRangeBuckets = (
	offers: Offer[],
	field: 'salary' | 'hours',
	selectedLabels: string[] | undefined,
	bucketLookup: Map<string, RangeBucket>,
): Offer[] => {
	if (!selectedLabels || selectedLabels.length === 0) return offers

	return offers.filter((offer) => {
		const offerRange = offer[field]

		if (field === 'salary' && !offerRange) return false

		return selectedLabels.some((label) => {
			const bucket = bucketLookup.get(label)
			if (!bucket) return false

			const min = offerRange?.min ?? null
			const max = offerRange?.max ?? null

			return rangeOverlaps(min, max, bucket.min, bucket.max)
		})
	})
}

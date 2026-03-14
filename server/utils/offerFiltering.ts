import type { Filters, Offer, RangeBucket } from '~/types'
import { EXACT_MATCH_FILTERS, HOURS_BUCKETS, SALARY_BUCKETS } from '../constants'

// ============================================================================
// Range Filter/Bucket utilities
// ============================================================================

/**
 * Creates a memoized Map for range filter bucket lookup by label
 */
const createBucketLookup = (buckets: RangeBucket[]): Map<string, RangeBucket> => {
	return new Map(buckets.map((bucket) => [bucket.label, bucket]))
}

/**
 * Checks if an offer's range overlaps with a bucket's range
 */
const rangeOverlaps = (
	offerMin: number | null,
	offerMax: number | null,
	bucketMin: number,
	bucketMax: number | null,
): boolean => {
	if (offerMin === null && offerMax === null) return false

	const effectiveOfferMin = offerMin ?? 0
	const effectiveOfferMax = offerMax ?? Number.POSITIVE_INFINITY
	const effectiveBucketMax = bucketMax ?? Number.POSITIVE_INFINITY

	return effectiveOfferMin <= effectiveBucketMax && effectiveOfferMax >= bucketMin
}

const salaryBucketLookup = createBucketLookup(SALARY_BUCKETS)
const hoursBucketLookup = createBucketLookup(HOURS_BUCKETS)

// ============================================================================
// Filter Functions
// ============================================================================

/**
 * Filters offers by search term (case-insensitive title match)
 */
const filterBySearch = (offers: Offer[], searchTerm: string | undefined): Offer[] => {
	if (!searchTerm) return offers

	const searchLower = searchTerm.toLowerCase()
	return offers.filter((offer) => offer.title.toLowerCase().includes(searchLower))
}

/**
 * Filters offers by exact match on a field
 */
const filterByExactMatch = (
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
const filterByRangeBuckets = (
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

/**
 * Applies all filters to the offers array
 */
export const applyFilters = (offers: Offer[], filters: Filters): Offer[] => {
	let result = offers

	result = filterBySearch(result, filters.search)

	EXACT_MATCH_FILTERS.forEach((key) => {
		result = filterByExactMatch(result, key, filters[key])
	})

	result = filterByRangeBuckets(result, 'salary', filters.salary, salaryBucketLookup)
	result = filterByRangeBuckets(result, 'hours', filters.hours, hoursBucketLookup)

	return result
}

// ============================================================================
// Metadata Generation
// ============================================================================

/**
 * Extracts unique values from offers for a given field
 */
const getUniqueValues = (offers: Offer[], field: keyof Offer): string[] => {
	const values = new Set<string>()

	offers.forEach((offer) => {
		const value = offer[field]
		if (typeof value === 'string') {
			values.add(value)
		}
	})

	return Array.from(values).sort()
}

/**
 * Generates filter options metadata from all offers
 */
export const generateFilterMetadata = (offers: Offer[]) => {
	return {
		cities: getUniqueValues(offers, 'city'),
		departments: getUniqueValues(offers, 'department'),
		hours: HOURS_BUCKETS.map((bucket) => bucket.label),
		salary: SALARY_BUCKETS.map((bucket) => bucket.label),
	}
}

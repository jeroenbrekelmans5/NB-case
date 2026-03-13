import type { RangeBucket } from '~/types'

/**
 * Creates a memoized Map for O(1) bucket lookups by label
 */
export const createBucketLookup = (buckets: RangeBucket[]): Map<string, RangeBucket> => {
	return new Map(buckets.map((bucket) => [bucket.label, bucket]))
}

/**
 * Checks if an offer's range overlaps with a bucket's range
 */
export const rangeOverlaps = (
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

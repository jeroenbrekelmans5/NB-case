import { EXACT_MATCH_FILTERS, HOURS_BUCKETS, SALARY_BUCKETS } from '../constants'
import { mapOffers } from '../mappers/offers'
import type { RecruiteeApiResponse } from '../types/backend'
import { createBucketLookup } from '../utils/buckets'
import { filterByExactMatch, filterByRangeBuckets, filterBySearch } from '../utils/filters'
import { getUniqueValues } from '../utils/metadata'
import { parseFiltersFromQuery } from '../utils/queryParser'

const salaryBucketLookup = createBucketLookup(SALARY_BUCKETS)
const hoursBucketLookup = createBucketLookup(HOURS_BUCKETS)

export default defineEventHandler(async (event) => {
	try {
		const response = await $fetch<RecruiteeApiResponse>(
			'https://rebogroep.recruitee.com/api/offers/',
		)

		const mappedOffers = mapOffers(response.offers)
		const filters = parseFiltersFromQuery(event)

		let filteredOffers = mappedOffers

		filteredOffers = filterBySearch(filteredOffers, filters.search)

		EXACT_MATCH_FILTERS.forEach((key) => {
			filteredOffers = filterByExactMatch(filteredOffers, key, filters[key])
		})

		filteredOffers = filterByRangeBuckets(
			filteredOffers,
			'salary',
			filters.salary,
			salaryBucketLookup,
		)
		filteredOffers = filterByRangeBuckets(
			filteredOffers,
			'hours',
			filters.hours,
			hoursBucketLookup,
		)

		return {
			offers: filteredOffers,
			filters: {
				cities: getUniqueValues(mappedOffers, 'city'),
				departments: getUniqueValues(mappedOffers, 'department'),
				hours: HOURS_BUCKETS.map((bucket) => bucket.label),
				salary: SALARY_BUCKETS.map((bucket) => bucket.label),
			},
		}
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch offers from Recruitee API',
		})
	}
})

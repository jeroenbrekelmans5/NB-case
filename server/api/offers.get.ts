import { mapOffers } from '../mappers/offers'
import type { RecruiteeApiResponse } from '../types/backend'
import { applyFilters, generateFilterMetadata } from '../utils/offerFiltering'
import { parseFiltersFromQuery } from '../utils/queryParser'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 6

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const pageNumber = Math.max(1, parseInt(String(query.page ?? DEFAULT_PAGE), 10) || DEFAULT_PAGE)

	const response = await $fetch<RecruiteeApiResponse>(
		'https://rebogroep.recruitee.com/api/offers/',
	)

	const offers = mapOffers(response.offers)
	const filters = parseFiltersFromQuery(event)
	const filteredOffers = applyFilters(offers, filters)
	const total = filteredOffers.length
	const offset = (pageNumber - 1) * DEFAULT_LIMIT
	const paginatedOffers = filteredOffers.slice(offset, offset + DEFAULT_LIMIT)

	return {
		offers: paginatedOffers,
		filters: generateFilterMetadata(offers),
		pagination: {
			page: pageNumber,
			limit: DEFAULT_LIMIT,
			total,
			totalPages: Math.ceil(total / DEFAULT_LIMIT),
		},
	}
})

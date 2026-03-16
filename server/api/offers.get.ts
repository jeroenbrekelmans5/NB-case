import { DEFAULT_OFFERS_PER_PAGE, DEFAULT_PAGE } from '../constants'
import { mapOffers } from '../mappers/offers'
import type { RecruiteeApiResponse } from '../types/backend'
import { applyFilters, generateFilterMetadata } from '../utils/offerFiltering'
import { parseFiltersFromQuery } from '../utils/queryParser'

const fetchOffers = defineCachedFunction(
	async () => {
		const response = await $fetch<RecruiteeApiResponse>(
			'https://rebogroep.recruitee.com/api/offers/',
		)
		return mapOffers(response.offers)
	},
	{
		maxAge: 60 * 5,
		name: 'recruitee-offers',
	},
)

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const pageNumber = Math.max(1, parseInt(String(query.page ?? DEFAULT_PAGE), 10) || DEFAULT_PAGE)

	const offers = await fetchOffers()
	const filters = parseFiltersFromQuery(event)
	const filteredOffers = applyFilters(offers, filters)
	const total = filteredOffers.length
	const offset = (pageNumber - 1) * DEFAULT_OFFERS_PER_PAGE
	const paginatedOffers = filteredOffers.slice(offset, offset + DEFAULT_OFFERS_PER_PAGE)

	return {
		offers: paginatedOffers,
		filters: generateFilterMetadata(offers),
		pagination: {
			page: pageNumber,
			limit: DEFAULT_OFFERS_PER_PAGE,
			total,
			totalPages: Math.ceil(total / DEFAULT_OFFERS_PER_PAGE),
		},
	}
})

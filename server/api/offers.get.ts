import { mapOffers } from '../mappers/offers'
import type { RecruiteeApiResponse } from '../types/backend'
import { applyFilters, generateFilterMetadata } from '../utils/offerFiltering'
import { parseFiltersFromQuery } from '../utils/queryParser'

export default defineEventHandler(async (event) => {
	const response = await $fetch<RecruiteeApiResponse>(
		'https://rebogroep.recruitee.com/api/offers/',
	)

	const offers = mapOffers(response.offers)
	const filters = parseFiltersFromQuery(event)

	return {
		offers: applyFilters(offers, filters),
		filters: generateFilterMetadata(offers),
	}
})

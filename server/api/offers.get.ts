import { mapOffers } from '../mappers/offers'
import type { RecruiteeApiResponse } from '../types/backend'

export default defineEventHandler(async () => {
	try {
		const response = await $fetch<RecruiteeApiResponse>(
			'https://rebogroep.recruitee.com/api/offers/',
		)

		const mappedOffers = mapOffers(response.offers)

		return { offers: mappedOffers }
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch offers from Recruitee API',
		})
	}
})

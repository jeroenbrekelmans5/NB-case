import type { RecruiteeApiResponse } from '../types/recruitee'

export default defineEventHandler(async (event) => {
	try {
		const data = await $fetch<RecruiteeApiResponse>(
			'https://rebogroep.recruitee.com/api/offers/'
		)

		const mappedOffers = mapOffers(data.offers)

		return { offers: mappedOffers }
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch offers from Recruitee API'
		})
	}
})

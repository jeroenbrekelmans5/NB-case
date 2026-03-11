import type { Offer } from '../../types'
import type { RecruiteeOffer } from '../types/backend'
import { EXPERIENCE_CODES } from '../constants'

export const mapOffer = (offer: RecruiteeOffer): Offer => {
	return {
		id: offer.id,
		title: offer.title,
		location: offer.location,
		department: offer.department,
		experience: offer.experience_code ? (EXPERIENCE_CODES[offer.experience_code] || null) : null,
		salary: offer.salary
			? {
					min: offer.salary.min ? parseInt(offer.salary.min) : null,
					max: offer.salary.max ? parseInt(offer.salary.max) : null,
					period: offer.salary.period,
					currency: offer.salary.currency || 'EUR',
				}
			: null,
		hours: {
			min: offer.min_hours,
			max: offer.max_hours,
		},
	}
}

export const mapOffers = (offers: RecruiteeOffer[]): Offer[] => {
	return offers.map(mapOffer)
}

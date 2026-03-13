export type Experience = 'Student' | 'Junior' | 'Medior' | 'Senior'

export interface Offer {
	id: number
	title: string
	city: string
	location: string
	department: string | null
	experience: Experience | null
	salary: {
		min: number | null
		max: number | null
		period: string | null
		currency: string
	} | null
	hours: {
		min: number | null
		max: number | null
	}
}

export interface OfferFilters {
	city: string[]
	department: string[]
	search: string
}

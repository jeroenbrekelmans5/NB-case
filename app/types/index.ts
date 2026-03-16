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

export type Filters = {
	search?: string
	city?: string[]
	department?: string[]
	hours?: string[]
	salary?: string[]
}

export type ArrayFilterKey = 'city' | 'department' | 'hours' | 'salary'
export type RangeBucket = {
	min: number
	max: number | null
	label: string
}

export type FilterConfig = {
	key: ArrayFilterKey
	label: string
	options: string[]
}

export type Pagination = {
	page: number
	limit: number
	total: number
	totalPages: number
}

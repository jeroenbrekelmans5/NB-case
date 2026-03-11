export interface RecruiteeApiResponse {
	offers: RecruiteeOffer[]
}

export interface RecruiteeOffer {
	id: number
	title: string
	slug: string
	location: string
	city: string
	state_name: string
	country: string
	employment_type_code: string
	min_hours: number | null
	max_hours: number | null
	salary: {
		min: string | null
		max: string | null
		period: string | null
		currency: string | null
	} | null
	description: string
	requirements: string | null
	published_at: string
	careers_url: string
	department: string | null
	tags: string[]
	remote: boolean
	hybrid: boolean
	on_site: boolean
}

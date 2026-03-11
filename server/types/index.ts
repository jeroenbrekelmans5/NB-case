export interface Offer {
	title: string
	location: string
	department: string | null
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

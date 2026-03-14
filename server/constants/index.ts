import type { ArrayFilterKey, Experience, RangeBucket } from '~/types'
import type { RecruiteeExperienceCode } from '../types/backend'

export const EXPERIENCE_CODES: Record<RecruiteeExperienceCode, Experience> = {
	student_college: 'Student',
	junior_level: 'Junior',
	mid_level: 'Medior',
	experienced: 'Senior',
}

export const EXACT_MATCH_FILTERS: ArrayFilterKey[] = ['city', 'department']
export const RANGE_FILTERS: ArrayFilterKey[] = ['hours', 'salary']
export const ARRAY_FILTERS: ArrayFilterKey[] = [...EXACT_MATCH_FILTERS, ...RANGE_FILTERS]

export const SALARY_BUCKETS: RangeBucket[] = [
	{ min: 0, max: 2000, label: '€0 - €2000' },
	{ min: 2000, max: 3000, label: '€2000 - €3000' },
	{ min: 3000, max: 4000, label: '€3000 - €4000' },
	{ min: 4000, max: 5000, label: '€4000 - €5000' },
	{ min: 5000, max: null, label: '€5000+' },
]

export const HOURS_BUCKETS: RangeBucket[] = [
	{ min: 0, max: 16, label: '0-16 uur' },
	{ min: 16, max: 24, label: '16-24 uur' },
	{ min: 24, max: 32, label: '24-32 uur' },
	{ min: 32, max: 40, label: '32-40 uur' },
	{ min: 40, max: null, label: '40+ uur' },
]

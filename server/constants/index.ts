import type { Experience } from '../../types'
import type { RecruiteeExperienceCode } from '../types/backend'

export const EXPERIENCE_CODES: Record<RecruiteeExperienceCode, Experience> = {
	student_college: 'Student',
	junior_level: 'Junior',
	mid_level: 'Medior',
	experienced: 'Senior',
}

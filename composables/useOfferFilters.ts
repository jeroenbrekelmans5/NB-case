import type { LocationQuery } from 'vue-router'
import type { Offer } from '../types'

type Filters = {
	search?: string
	city?: string[]
	department?: string[]
	experience?: string[]
}

type ArrayFilterKey = 'city' | 'department' | 'experience'

const ARRAY_FILTERS: ArrayFilterKey[] = ['city', 'department', 'experience']

const parseQueryParam = (query: LocationQuery, key: string): string[] => {
	return query[key] ? (query[key] as string).split(',') : []
}

export const useOfferFilters = (offers: Ref<Offer[]>) => {
	const route = useRoute()

	const filters = reactive<Filters>({
		search: route.query.search as string | undefined,
		...Object.fromEntries(ARRAY_FILTERS.map((key) => [key, parseQueryParam(route.query, key)])),
	})

	watch(
		filters,
		(newFilters) => {
			const query: Record<string, string> = {}

			if (newFilters.search) {
				query.search = newFilters.search
			}

			ARRAY_FILTERS.forEach((key) => {
				const value = newFilters[key]
				if (value && value.length > 0) {
					query[key] = value.join(',')
				}
			})

			navigateTo({ query }, { replace: true })
		},
		{ deep: true },
	)

	watch(
		() => route.query,
		(query) => {
			filters.search = query.search as string | undefined
			ARRAY_FILTERS.forEach((key) => {
				filters[key] = parseQueryParam(query, key)
			})
		},
	)

	const filteredOffers = computed(() => {
		let result = offers.value

		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter((offer) => offer.title.toLowerCase().includes(searchLower))
		}

		ARRAY_FILTERS.forEach((key) => {
			const filterValues = filters[key]
			if (filterValues && filterValues.length > 0) {
				result = result.filter((offer) => {
					const offerValue = offer[key] as string | undefined
					return !!offerValue && filterValues.includes(offerValue)
				})
			}
		})

		return result
	})

	const clearFilters = () => {
		filters.search = undefined
		ARRAY_FILTERS.forEach((key) => {
			filters[key] = []
		})
	}

	const getUniqueValues = (key: ArrayFilterKey): string[] => {
		const values = new Set<string>()
		offers.value.forEach((offer) => {
			const value = offer[key] as string | undefined
			if (value) values.add(value)
		})
		return Array.from(values).sort()
	}

	const cities = computed(() => getUniqueValues('city'))
	const departments = computed(() => getUniqueValues('department'))
	const experiences = computed(() => getUniqueValues('experience'))

	return {
		clearFilters,
		filters,
		filteredOffers,
		cities,
		departments,
		experiences,
	}
}

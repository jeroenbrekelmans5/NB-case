import type { Offer } from '../types'

interface Filters {
	search?: string
}

export const useOfferFilters = (offers: Ref<Offer[]>) => {
	const route = useRoute()
	const router = useRouter()

	const filters = reactive<Filters>({
		search: route.query.search as string | '',
	})

	watch(
		() => filters,
		(newFilters) => {
			const query: Record<string, string> = {}

			if (newFilters.search) {
				query.search = newFilters.search
			}

			router.push({ query })
		},
		{ deep: true },
	)

	const filteredOffers = computed(() => {
		let result = offers.value

		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter((offer) => offer.title.toLowerCase().includes(searchLower))
		}

		return result
	})

	const clearFilters = () => {
		Object.keys(filters).forEach((key) => {
			filters[key as keyof Filters] = undefined
		})
	}

	return {
		clearFilters,
		filters,
		filteredOffers,
	}
}

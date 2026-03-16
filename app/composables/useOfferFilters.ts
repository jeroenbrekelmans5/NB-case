import { useDebounceFn } from '@vueuse/core'
import { ARRAY_FILTERS } from '~/constants'
import type { Filters } from '~/types'
import { parseQueryParam, serializeFilters } from '~/utils/queryParams'

export const useOfferFilters = () => {
	const route = useRoute()
	const router = useRouter()

	const filters = reactive<Filters>({
		search: route.query.search as string | undefined,
		...Object.fromEntries(ARRAY_FILTERS.map((key) => [key, parseQueryParam(route.query, key)])),
	})

	const syncUrlWithFilters = useDebounceFn((newFilters: Filters) => {
		const query = serializeFilters(newFilters, ARRAY_FILTERS)
		router.replace({ query })
	}, 300)

	watch(filters, syncUrlWithFilters, { deep: true })

	const clearFilters = () => {
		Object.keys(filters).forEach((key) => {
			filters[key as keyof Filters] = undefined
		})
	}

	return {
		clearFilters,
		filters,
	}
}

import { useDebounceFn } from '@vueuse/core'
import { ARRAY_FILTERS, EXACT_MATCH_FILTERS, HOURS_BUCKETS, SALARY_BUCKETS } from '~/constants'
import { parseQueryParam, serializeFilters } from '~/lib/common/queryParams'
import { createBucketLookup } from '~/lib/offers/buckets'
import {
	filterByExactMatch,
	filterByRangeBuckets,
	filterBySearch,
	getUniqueValues,
} from '~/lib/offers/filters'
import type { Filters, Offer } from '~/types'

const salaryBucketLookup = createBucketLookup(SALARY_BUCKETS)
const hoursBucketLookup = createBucketLookup(HOURS_BUCKETS)

export const useOfferFilters = (offers: Ref<Offer[]>) => {
	const route = useRoute()
	const router = useRouter()

	// Initialize filters from URL query params
	const filters = reactive<Filters>({
		search: route.query.search as string | undefined,
		...Object.fromEntries(ARRAY_FILTERS.map((key) => [key, parseQueryParam(route.query, key)])),
	})

	// Debounced URL sync to batch multiple filter changes
	const syncUrlWithFilters = useDebounceFn((newFilters: Filters) => {
		const query = serializeFilters(newFilters, ARRAY_FILTERS)
		router.replace({ query })
	}, 150)

	watch(filters, syncUrlWithFilters, { deep: true })

	// Apply all filters to offers
	const filteredOffers = computed(() => {
		let result = offers.value

		// Search filter
		result = filterBySearch(result, filters.search)

		// Exact match filters (city, department)
		EXACT_MATCH_FILTERS.forEach((key) => {
			result = filterByExactMatch(result, key, filters[key])
		})

		// Range filters (salary, hours)
		result = filterByRangeBuckets(result, 'salary', filters.salary, salaryBucketLookup)
		result = filterByRangeBuckets(result, 'hours', filters.hours, hoursBucketLookup)

		return result
	})

	const clearFilters = () => {
		filters.search = undefined
		ARRAY_FILTERS.forEach((key) => {
			filters[key] = []
		})
	}

	// Computed options for filter dropdowns
	const cities = computed(() => getUniqueValues(offers.value, 'city'))
	const departments = computed(() => getUniqueValues(offers.value, 'department'))
	const hours = computed(() => HOURS_BUCKETS.map((bucket) => bucket.label))
	const salary = computed(() => SALARY_BUCKETS.map((bucket) => bucket.label))

	return {
		clearFilters,
		filters,
		filteredOffers,
		cities,
		departments,
		hours,
		salary,
	}
}

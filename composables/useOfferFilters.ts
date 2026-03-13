import type { LocationQuery } from 'vue-router'
import { ARRAY_FILTERS, EXACT_MATCH_FILTERS, HOURS_BUCKETS, SALARY_BUCKETS } from '~/constants'
import type { ArrayFilterKey, Filters, Offer, RangeBucket } from '../types'

const parseQueryParam = (query: LocationQuery, key: string): string[] => {
	return query[key] ? (query[key] as string).split(',') : []
}

const rangeOverlaps = (
	offerMin: number | null,
	offerMax: number | null,
	bucketMin: number,
	bucketMax: number | null,
): boolean => {
	if (offerMin === null && offerMax === null) return false

	const effectiveOfferMin = offerMin ?? 0
	const effectiveOfferMax = offerMax ?? Number.POSITIVE_INFINITY
	const effectiveBucketMax = bucketMax ?? Number.POSITIVE_INFINITY

	return effectiveOfferMin <= effectiveBucketMax && effectiveOfferMax >= bucketMin
}

const findBucketByLabel = (label: string, buckets: RangeBucket[]): RangeBucket | undefined => {
	return buckets.find((bucket) => bucket.label === label)
}

export const useOfferFilters = (offers: Ref<Offer[]>) => {
	const route = useRoute()
	const router = useRouter()

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

			router.replace({ query })
		},
		{ deep: true },
	)

	const filteredOffers = computed(() => {
		let result = offers.value

		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter((offer) => offer.title.toLowerCase().includes(searchLower))
		}

		EXACT_MATCH_FILTERS.forEach((key) => {
			const filterValues = filters[key]
			if (filterValues && filterValues.length > 0) {
				result = result.filter((offer) => {
					const offerValue = offer[key] as string | undefined
					return !!offerValue && filterValues.includes(offerValue)
				})
			}
		})

		if (filters.salary && filters.salary.length > 0) {
			result = result.filter((offer) => {
				if (!offer.salary) return false

				return filters.salary!.some((selectedLabel) => {
					const bucket = findBucketByLabel(selectedLabel, SALARY_BUCKETS)
					if (!bucket) return false

					return rangeOverlaps(
						offer.salary!.min,
						offer.salary!.max,
						bucket.min,
						bucket.max,
					)
				})
			})
		}

		if (filters.hours && filters.hours.length > 0) {
			result = result.filter((offer) => {
				return filters.hours!.some((selectedLabel) => {
					const bucket = findBucketByLabel(selectedLabel, HOURS_BUCKETS)
					if (!bucket) return false

					return rangeOverlaps(offer.hours.min, offer.hours.max, bucket.min, bucket.max)
				})
			})
		}

		return result
	})

	const clearFilters = () => {
		filters.search = undefined
		ARRAY_FILTERS.forEach((key) => {
			filters[key] = []
		})
	}

	const getUniqueArrayValues = (key: ArrayFilterKey): string[] => {
		const values = new Set<string>()
		offers.value.forEach((offer) => {
			const value = offer[key] as string | undefined
			if (value) values.add(value)
		})
		return Array.from(values).sort()
	}

	const cities = computed(() => getUniqueArrayValues('city'))
	const departments = computed(() => getUniqueArrayValues('department'))
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

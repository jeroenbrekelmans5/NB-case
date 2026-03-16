<script setup lang="ts">
import { useOfferFilters } from '~/composables/useOfferFilters'
import type { FilterConfig } from '~/types'

const route = useRoute()
const { data, pending } = await useFetch('/api/offers', {
	key: 'offers',
	query: computed(() => route.query),
	watch: [() => route.query],
})

const offers = computed(() => data.value?.offers || [])
const pagination = computed(() => data.value?.pagination)

const router = useRouter()
const goToPage = (page: number) => {
	const query = { ...route.query, page }
	router.push({ query })
}

const { filters, clearFilters } = useOfferFilters()

const filterConfigs = computed<FilterConfig[]>(() => [
	{ key: 'hours', label: 'Aantal uur', options: data.value?.filters?.hours || [] },
	{ key: 'salary', label: 'Salaris', options: data.value?.filters?.salary || [] },
	{ key: 'city', label: 'Plaats', options: data.value?.filters?.cities || [] },
	{ key: 'department', label: 'Afdeling', options: data.value?.filters?.departments || [] },
])
</script>

<template>
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold text-center mb-8">NOBEARS CASE</h1>

		<button
			@click="clearFilters"
			class="flex justify-self-end mb-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
		>
			Klik hier om je filters te resetten
		</button>
		<div>
			<div class="mb-6 space-y-4">
				<SearchBar v-model="filters.search" placeholder="Zoek op functietitel..." />

				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<SelectFilter
						v-for="config in filterConfigs"
						:key="config.key"
						v-model="filters[config.key]"
						:label="config.label"
						:options="config.options"
						multiSelect
					/>
				</div>
			</div>

			<h2 class="text-lg font-bold text-blue-600 mb-4">
				<template v-if="pagination">{{ pagination.total }} vacatures </template>
				<template v-else>{{ offers.length }} vacatures</template>
			</h2>

			<div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<OfferCardSkeleton v-for="n in pagination?.limit" :key="n" />
			</div>
			<div v-else-if="offers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<template v-for="offer in offers" :key="offer.id">
					<NuxtLink
						:to="{ path: `/${offer.id}`, query: route.query }"
						class="block transition-transform duration-200 hover:-translate-y-2"
					>
						<OfferCard class="h-full" :offer="offer" />
					</NuxtLink>
				</template>
			</div>
			<div v-else class="flex flex-col items-center justify-center text-center gap-4 py-12">
				<p class="text-gray-500 text-lg">Geen vacatures gevonden op basis van je filters</p>
			</div>
			<Pagination
				v-if="pagination && pagination.totalPages > 1"
				:pagination="pagination"
				@go-to-page="goToPage"
			/>
		</div>
	</div>
</template>

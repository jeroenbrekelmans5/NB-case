<script setup lang="ts">
import { useOfferFilters } from '../../composables/useOfferFilters'

const { data, pending } = await useFetch('/api/offers')
const route = useRoute()
const offers = computed(() => data.value?.offers || [])

const { filters, filteredOffers, clearFilters, cities, departments, experiences } =
	useOfferFilters(offers)
</script>

<template>
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold text-center mb-8">NOBEARS CASE</h1>

		<div v-if="pending">
			<p class="text-gray-500">Loading...</p>
		</div>
		<div v-else-if="data">
			<div class="mb-6 space-y-4">
				<SearchBar v-model="filters.search" placeholder="Zoek op functietitel..." />

				<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<MultiSelectFilter v-model="filters.city" label="Locatie" :options="cities" />
					<MultiSelectFilter
						v-model="filters.department"
						label="Afdeling"
						:options="departments"
					/>
					<MultiSelectFilter
						v-model="filters.experience"
						label="Ervaring"
						:options="experiences"
					/>
				</div>
			</div>

			<h2 class="text-lg font-bold text-blue-600 mb-4">
				{{ filteredOffers.length }} van de {{ data.offers.length }} vacatures
			</h2>

			<div v-if="filteredOffers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<template v-for="offer in filteredOffers" :key="offer.id">
					<NuxtLink :to="{ path: `/${offer.id}`, query: route.query }">
						<OfferCard class="h-full" :offer="offer" />
					</NuxtLink>
				</template>
			</div>
			<div v-else class="flex flex-col items-center justify-center text-center gap-4 py-12">
				<p class="text-gray-500 text-lg">Geen vacatures gevonden op basis van je filters</p>
				<button
					@click="clearFilters"
					class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Klik hier om je filters te resetten
				</button>
			</div>
		</div>
		<div v-else>
			<p>No offers found</p>
		</div>
	</div>
</template>

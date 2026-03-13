<script setup lang="ts">
import { useOfferFilters } from '../../composables/useOfferFilters'

const { data, pending } = await useFetch('/api/offers')

const offers = computed(() => data.value?.offers || [])
const { filters, filteredOffers, clearFilters } = useOfferFilters(offers)
</script>

<template>
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold text-center mb-8">NOBEARS CASE</h1>

		<div v-if="pending">
			<p class="text-gray-500">Loading...</p>
		</div>
		<div v-else-if="data">
			<div class="mb-6">
				<SearchBar v-model="filters.search" placeholder="Zoek op functietitel..." />
			</div>

			<h2 class="text-lg font-bold text-blue-600 mb-4">
				{{ filteredOffers.length }} van de {{ data.offers.length }} vacatures
			</h2>

			<div v-if="filteredOffers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<OfferCard v-for="offer in filteredOffers" :key="offer.id" :offer="offer" />
			</div>
			<div v-else class="text-center py-12">
				<p class="text-gray-500 text-lg">Geen vacatures gevonden</p>
				<button @click="clearFilters">Klik hier om je filters te resetten</button>
			</div>
		</div>
		<div v-else>
			<p>No offers found</p>
		</div>
	</div>
</template>

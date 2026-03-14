<script setup lang="ts">
import { useOfferFilters } from '~/composables/useOfferFilters'
import type { ArrayFilterKey } from '~/types'

const route = useRoute()
const { data, pending } = await useFetch('/api/offers', {
	key: 'offers',
	query: computed(() => route.query),
	watch: [() => route.query],
})

const offers = computed(() => data.value?.offers || [])
const cities = computed(() => data.value?.filters?.cities || [])
const departments = computed(() => data.value?.filters?.departments || [])
const hours = computed(() => data.value?.filters?.hours || [])
const salary = computed(() => data.value?.filters?.salary || [])

const { filters, clearFilters } = useOfferFilters()

const filterConfigs = computed<{ key: ArrayFilterKey; label: string; options: string[] }[]>(() => [
	{ key: 'hours', label: 'Aantal uur', options: hours.value },
	{ key: 'salary', label: 'Salaris', options: salary.value },
	{ key: 'city', label: 'Plaats', options: cities.value },
	{ key: 'department', label: 'Afdeling', options: departments.value },
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

			<h2 class="text-lg font-bold text-blue-600 mb-4">{{ offers.length }} vacatures</h2>

			<div v-if="pending">
				<p class="text-gray-500">Loading...</p>
			</div>
			<div v-else-if="offers.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<template v-for="offer in offers" :key="offer.id">
					<NuxtLink :to="{ path: `/${offer.id}`, query: route.query }">
						<OfferCard class="h-full" :offer="offer" />
					</NuxtLink>
				</template>
			</div>
			<div v-else class="flex flex-col items-center justify-center text-center gap-4 py-12">
				<p class="text-gray-500 text-lg">Geen vacatures gevonden op basis van je filters</p>
			</div>
		</div>
	</div>
</template>

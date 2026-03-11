<script setup lang="ts">
const { data, pending } = await useFetch('/api/offers')

console.log(data)
</script>

<template>
	<div class="container mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold">Offers</h1>

		<div v-if="pending">
			<p class="text-gray-500">Loading...</p>
		</div>
		<div v-else-if="data">
			<h2 class="text-lg font-bold">
				We hebben momenteel {{ data?.offers.length }} vacatures
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<OfferCard v-for="offer in data.offers" :key="offer.id" :offer="offer" />
			</div>
		</div>
		<div v-else>
			<p>No offers found</p>
		</div>
	</div>
</template>

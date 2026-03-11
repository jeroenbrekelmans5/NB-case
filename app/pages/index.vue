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
			<OfferCard v-for="offer in data.offers" :key="offer.id" v-bind="{ offer }" />
		</div>
		<div v-else>
			<p>No offers found</p>
		</div>
	</div>
</template>

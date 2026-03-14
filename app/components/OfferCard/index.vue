<script setup lang="ts">
import type { Offer } from '~/types'

defineProps<{
	offer: Offer
}>()
</script>

<template>
	<div class="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4">
		<span v-if="offer.experience">{{ offer.experience }}</span>
		<h2 class="text-lg font-bold text-blue-600">{{ offer.title }}</h2>
		<div class="flex flex-col gap-1">
			<span>{{ offer.location }}</span>

			<span v-if="offer.hours.min"
				>Aantal uur: {{ offer.hours.min }} - {{ offer.hours.max }}</span
			>
			<span v-if="offer.salary && offer.salary.min">
				Salaris: {{ offer.salary.currency === 'EUR' ? '€' : offer.salary.currency }}
				{{ offer.salary.min }} - {{ offer.salary.max }}
			</span>
		</div>
	</div>
</template>

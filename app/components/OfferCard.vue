<script setup lang="ts">
import type { Offer } from '../../server/types'

defineProps<{
	offer: Offer
}>()
</script>

<template>
	<div class="bg-white rounded-lg shadow-md p-4">
		<h2 class="text-lg font-bold">{{ offer.title }}</h2>
		<p class="text-gray-500">{{ offer.location }}</p>
		<p class="text-gray-500" v-if="offer.department">{{ offer.department }}</p>
		<p class="text-gray-500" v-if="offer.salary">
			{{ offer.salary.currency }} {{ offer.salary.min }} - {{ offer.salary.max }}
		</p>
		<p class="text-gray-500">{{ offer.hours.min }} - {{ offer.hours.max }} hours</p>
	</div>
</template>

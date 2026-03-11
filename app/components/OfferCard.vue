<script setup lang="ts">
import type { Offer } from '../../types'

defineProps<{
	offer: Offer
}>()
</script>

<template>
	<div class="bg-white rounded-lg shadow-md p-4">
		<h2 class="text-lg font-bold mb-4">{{ offer.title }}</h2>
		<div class="flex flex-col gap-2">
			<span class="text-gray-800" v-if="offer.experience">{{ offer.experience }}</span>
			<span class="text-gray-800">{{ offer.location }}</span>
			<span class="text-gray-800" v-if="offer.department">{{ offer.department }}</span>
			<span class="text-gray-800" v-if="offer.salary">
				{{ offer.salary.currency }} {{ offer.salary.min }} - {{ offer.salary.max }}
			</span>
			<span class="text-gray-800">{{ offer.hours.min }} - {{ offer.hours.max }} hours</span>
		</div>
	</div>
</template>

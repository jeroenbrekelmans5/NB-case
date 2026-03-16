<script setup lang="ts">
import type { Pagination } from '~/types'

defineProps<{
	pagination: Pagination
}>()

const emit = defineEmits<{
	'go-to-page': [page: number]
}>()
</script>

<template>
	<div class="mt-8 flex items-center justify-center gap-4">
		<button
			:disabled="pagination.page <= 1"
			@click="emit('go-to-page', pagination.page - 1)"
			class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600"
		>
			Vorige
		</button>
		<span class="text-gray-600">
			Pagina {{ pagination.page }} van {{ pagination.totalPages }}
		</span>
		<button
			:disabled="pagination.page >= pagination.totalPages"
			@click="emit('go-to-page', pagination.page + 1)"
			class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600"
		>
			Volgende
		</button>
	</div>
</template>

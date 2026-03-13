<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const props = withDefaults(
	defineProps<{
		modelValue?: string
		placeholder: string
		debounceTime?: number
	}>(),
	{
		debounceTime: 300,
	},
)

const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()

const debouncedEmit = useDebounceFn(
	(value: string) => {
		emit('update:modelValue', value)
	},
	() => props.debounceTime,
)

const searchInput = computed({
	get: () => props.modelValue || '',
	set: (value: string) => debouncedEmit(value),
})
</script>

<template>
	<div class="relative">
		<input
			v-model="searchInput"
			type="text"
			:placeholder="placeholder"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
		/>
		<svg
			v-if="!searchInput"
			class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
		<button
			v-else
			@click="searchInput = ''"
			class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
</template>

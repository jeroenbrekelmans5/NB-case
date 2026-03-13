<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		label: string
		options: string[]
		modelValue?: string[]
	}>(),
	{
		modelValue: () => [],
	},
)

const emit = defineEmits<{
	'update:modelValue': [value: string[]]
}>()

const multiSelectFilter = ref<HTMLDivElement | null>(null)
const isExpanded = ref(false)

const toggleOption = (option: string) => {
	const current = props.modelValue.includes(option)
		? props.modelValue.filter((o) => o !== option)
		: [...props.modelValue, option]

	emit('update:modelValue', current)
}

const isSelected = (option: string) => {
	return props.modelValue.includes(option)
}

onClickOutside(multiSelectFilter, () => {
	isExpanded.value = false
})
</script>

<template>
	<div ref="multiSelectFilter" class="relative border border-gray-300 rounded-lg">
		<button
			@click="isExpanded = !isExpanded"
			class="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 rounded-lg"
		>
			<span class="font-medium">
				{{ label }}
				<span v-if="modelValue.length > 0"> ({{ modelValue.length }}) </span>
			</span>
			<svg
				class="w-5 h-5 transition-transform"
				:class="{ 'rotate-180': isExpanded }"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7"
				/>
			</svg>
		</button>

		<div
			v-if="isExpanded"
			class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-lg p-4 space-y-2 max-h-64 overflow-y-auto z-50"
		>
			<label
				v-for="option in options"
				:key="option"
				class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
			>
				<input
					type="checkbox"
					:checked="isSelected(option)"
					@change="toggleOption(option)"
					class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
				/>
				<span>{{ option }}</span>
			</label>
		</div>
	</div>
</template>

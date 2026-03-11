<script setup lang="ts">
const { data: offers, pending } = await useFetch('/api/offers')

console.log(offers)
</script>

<template></template>

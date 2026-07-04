<template>
  <div class="mb-4 flex flex-wrap gap-2">
    <UButton
      :variant="modelValue === null ? 'solid' : 'ghost'"
      @click="emit('update:modelValue', null)"
    >
      全て
    </UButton>
    <UButton
      v-for="publisher in publishers"
      :key="publisher.id"
      :variant="modelValue === publisher.id ? 'solid' : 'ghost'"
      @click="emit('update:modelValue', publisher.id)"
    >
      {{ publisher.name }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    publishers: { id: number; name: string }[]
    modelValue: number | null
  }>()

  const emit = defineEmits<{ "update:modelValue": [value: number | null] }>()
</script>

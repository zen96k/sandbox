<template>
  <div>
    <header class="border-b border-gray-200 dark:border-gray-800">
      <UContainer class="flex items-center justify-between py-3">
        <NuxtLink
          class="text-2xl font-semibold"
          to="/"
        >
          Sandbox
        </NuxtLink>
        <div class="flex items-center gap-2">
          <UColorModeButton />
          <UButton
            color="neutral"
            icon="i-simple-icons-github"
            target="_blank"
            to="https://github.com/zen96k/sandbox"
            variant="ghost"
          />
        </div>
      </UContainer>
    </header>
    <slot />
  </div>
</template>

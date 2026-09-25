<script setup>
defineOptions({ inheritAttrs: false });
</script>

<template>
  <button
    v-bind="$attrs"
    class="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
  >
    <slot />
  </button>
</template>

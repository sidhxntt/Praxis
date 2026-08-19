<script setup lang="ts">
import Button from "./components/ui/Button.vue";
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-background px-6 text-foreground">
    <section class="max-w-2xl text-center">
      <p class="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Praxis Flow</p>
      <h1 class="text-5xl font-semibold tracking-tight">{{projectName}}</h1>
      <p class="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">A clean Vue starter with Tailwind CSS and a local shadcn-compatible primitive.</p>
      <Button class="mt-8">Start building</Button>
    </section>
  </main>
</template>

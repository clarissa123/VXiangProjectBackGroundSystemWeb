<template>
  <div class="top">
    <slot name="search"></slot>
    <slot name="breadcrumb"></slot>
    <slot name="toggleTab"></slot>
    <slot name="btn"></slot>
  </div>
</template>

<script>
  export default {
    name: "top",
    data() {
      return {};
    }
  };
</script>

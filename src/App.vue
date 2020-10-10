<template>
  <div id="app">
    <div v-if="$route.meta.keepAlive">
      <Header></Header>
      <div class="bottomContent">
        <router-view />
      </div>
    </div>
    <router-view v-if="!$route.meta.keepAlive" />

    <!-- <router-view /> -->
  </div>
</template>
<script>
import Header from "./components/header.vue";
export default {
  data() {
    return {};
  },
  components: {
    Header
  },
  methods: {}
};
</script>

<style lang="less" >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  overflow: hidden;

  > div {
    width: 100%;
    height: 100%;
  }
}

.bottomContent {
  width: 100%;
  height: calc(100% - 80px);
  background: #f2f1f6;
}
</style>
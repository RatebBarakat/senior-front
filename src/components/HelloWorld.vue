<script>
import store from '@/store';
import { computed } from 'vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const username = computed(() => store.state.username);
    return {
      username
    };
  }
}
</script>

<template>
  {{ username }}
</template>

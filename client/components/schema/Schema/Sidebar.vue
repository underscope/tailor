<template>
  <div class="body">
    <meta-input
      v-for="prop in properties"
      :meta="prop"
      :key="`${path}.${prop.key}`"
      @input="update">
    </meta-input>
  </div>
</template>

<script>
import Meta from 'components/common/Meta';
import schemaMixin from './mixin.js';

export default {
  mixins: [schemaMixin(true)],
  components: {
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  padding: 6px 15px;
}

.publish-container {
  min-height: 70px;
  padding: 0 7px;

  .publish-date {
    width: 170px;
    line-height: 44px;
  }

  .btn {
    position: absolute;
    top: 10px;
    right: 24px;
    padding: 6px;
  }

  .circular-progress {
    width: 24px;
    margin: 0 20px;
  }
}

.discussion {
  margin-top: 32px;
  margin-bottom: 8px;
}

.type-label {
  display: inline-block;
  margin: 5px 0 25px 7px;
}
</style>

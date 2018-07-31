<template>
  <div class="body">
    <div
      v-for="(prop, index) in properties"
      :key="index"
    >
      <meta-input
        :meta="prop"
        @validate="validateProperty"
        @update="validateProperty"
        :ref="prop.key"
        class="meta-input"
      />
      <options-editor
        v-if="isSelectType && prop.key === 'type'"
        :options="options"
        @updateOptions="updateOptions"
      />
    </div>
  </div>
</template>

<script>
import Meta from 'components/common/Meta';
import OptionsEditor from './OptionsEditor';
import schemaMixin from './mixin.js';

export default {
  mixins: [schemaMixin(true)],
  components: {
    OptionsEditor,
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  padding: 6px 15px;
}
</style>

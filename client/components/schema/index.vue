<template>
  <div class="schemas-container">
    <bottom-popup ref="popup">
      <span duration:="3" class="bottom-popup">
        {{ this.errorMessage }}
      </span>
    </bottom-popup>
    <circular-progress v-if="showLoader" />
    <div v-else class="schemas">
      <div class="outline">
        <schema
          v-for="(schema, index) in getSchemas"
          v-if="schema"
          :key="index"
          :schema-exists="schemaExists"
          :path="String(index)"
          :design="subtype"
          :schema="schema"
          :current-selected="currentSelected"
          @create="createSchema"
          @focus="setCurrentSelected"
        >
        </schema>
      </div>
      <sidebar 
        :schema-exists="schemaExists"
        :current-selected="currentSelected"
        @save="update"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';

import Promise from 'bluebird';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';
import dropRight from 'lodash/dropRight';
import cloneDeep from 'lodash/cloneDeep';
import toPath from 'lodash/toPath';
import design, { getSubtypes, reach } from 'utils/schemaDesign.js';
import CircularProgress from 'components/common/CircularProgress';
import BottomPopup from 'components/common/BottomPopup';
import Schema from './Schema';
import Sidebar from './Sidebar';

export default {
  data() {
    return {
      design,
      showLoader: true,
      schemas: [],
      remoteSchemas: [],
      currentSelected: {},
      errorMessage: ''
    };
  },
  computed: {
    // ...mapGetters({ remoteSchemas: 'getSchemas' }, 'schemas'),
    subtype() {
      return getSubtypes(this.design)[0];
    },
    schemaExists() {
      const schemas = ([...this.remoteSchemas, ...this.schemas]);
      return !isEmpty(schemas) && !schemas.every(isUndefined);
    },
    getSchemas() {
      if (!this.schemaExists) return [{}];
      return this.schemas;
    },
  },
  methods: {
    ...mapActions({ fetchSchemas: 'fetch' }, 'schemas'),
    createSchema(schema) {
      const idExists = !!this.getSchemas.find(sch => (sch.id === schema.id));
      const errorMessage = `Schema with id: ${schema.id} already exists`;
      if (idExists) return this.errorPopup(errorMessage);
      this.schemas.push(schema);
      const currentIndex = this.getSchemas.indexOf(schema);
      this.setCurrentSelected(String(currentIndex));
    },
    showError(message) {
      this.errorMessage = message;
      this.$refs.popup.show();
    },
    update(updater) {
      updater(this.schemas);
      this.schemas = cloneDeep(this.schemas);
    },
    setCurrentSelected(path) {
      const parentPath = dropRight(toPath(path));
      this.currentSelected = {
        path,
        value: get(this.getSchemas, path),
        design: reach(design, path),
        parentRef: get(this.getSchemas, parentPath) || this.getSchemas
      };
    }
  },
  created() {
    return Promise.join(
      this.fetchSchemas(),
      Promise.delay(500)
        .then(() => {
          this.showLoader = false;
        })
    );
  },
  components: {
    Schema,
    Sidebar,
    CircularProgress,
    BottomPopup
  },
};
</script>

<style lang="scss" scoped>
.schemas-container, {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .bottom-popup {
    background-color: white;
    color: #d9534f;
    border-width: 15px;
    border-color: white;
    border-style: solid;
    border-radius: 15px;
    font-weight: 400;
    font-size: 16px;
  }

  .circular-progress {
    margin-top: 115px;
    align-self: center
  }

  .schemas {
  position: relative;
  height: 100%;
  padding-right: 420px;
  }

  .outline {
    height: 100%;
    width: 100%;
    float: left;
    padding: 80px 60px 0;
    overflow-y: scroll;
    overflow-y: overlay;
  }

  .outline /deep/ > :last-child {
    margin-bottom: 120px;
  }

}
</style>
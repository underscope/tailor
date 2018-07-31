<template>
  <div class="schemas-container">
    <bottom-popup ref="popup">
      <span duration:="5" class="bottom-popup">
        {{ this.errorMessage }}
      </span>
    </bottom-popup>
    <circular-progress v-if="showLoader" />
    <div v-else class="schemas">
      <div class="outline">
        <div class="schema-outline">
          <schema
            v-for="(schema, index) in getSchemas"
            v-if="schema"
            :key="index"
            :schema-exists="schemaExists"
            :path="String(index)"
            :schema="schema"
            :current-selected="currentSelected"
            @create="create"
            @error="showError"
            @focus="setCurrentSelected"
            class="schema"
          />
        </div>
        <create-button
          :schemas="this.schemas"
          :schema-exists="schemaExists"
          @create="create"
          @error="showError"
        />
      </div>
      <sidebar 
        :schema-exists="schemaExists"
        :current-selected="currentSelected"
        @update="update"
        @remove="remove"
        @error="showError"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';

import Promise from 'bluebird';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import set from 'lodash/set';
import join from 'lodash/join';
import unset from 'lodash/unset';
import toPath from 'lodash/toPath';
import isUndefined from 'lodash/isUndefined';
import dropRight from 'lodash/dropRight';
import cloneDeep from 'lodash/cloneDeep';
import { reach } from 'utils/schemaDesign.js';
import CircularProgress from 'components/common/CircularProgress';
import BottomPopup from 'components/common/BottomPopup';
import CreateButton from './Schema/CreateButton';
import Schema from './Schema';
import Sidebar from './Sidebar';

export default {
  data() {
    return {
      showLoader: true,
      schemas: [],
      remoteSchemas: [],
      currentSelected: {},
      errorMessage: ''
    };
  },
  computed: {
    // ...mapGetters({ remoteSchemas: 'getSchemas' }, 'schemas'),
    schemaExists() {
      const schemas = ([...this.remoteSchemas, ...this.schemas]);
      return !isEmpty(schemas) && !schemas.every(isUndefined);
    },
    getSchemas() {
      return this.schemas;
    },
  },
  methods: {
    ...mapActions({ fetchSchemas: 'fetch' }, 'schemas'),
    create(parentPath, item) {
      let parent = get(this.schemas, parentPath);
      if (!parent && !isEmpty(parentPath)) {
        set(this.schemas, parentPath, []);
        parent = get(this.schemas, parentPath);
      } else if (isEmpty(parentPath)) {
        parent = this.schemas;
      }
      const index = parent.length;
      const path = [...toPath(parentPath), index];
      parent.push(item);
      this.schemas = cloneDeep(this.schemas);
      this.setCurrentSelected(path);
    },
    update(path, item) {
      const schemas = cloneDeep(this.schemas);
      set(schemas, path, item);
      this.schemas = schemas;
    },
    remove(path) {
      const schemas = cloneDeep(this.schemas);
      unset(schemas, path);
      this.schemas = schemas;
    },
    showError(message) {
      this.errorMessage = message;
      this.$refs.popup.show();
    },
    setCurrentSelected(path) {
      const parentPath = dropRight(toPath(path));
      path = join(toPath(path), '.');
      this.currentSelected = {
        path,
        value: get(this.getSchemas, path),
        design: reach(path),
        parent: get(this.getSchemas, parentPath, this.getSchemas)
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
    BottomPopup,
    CreateButton
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

    .schema-outline /deep/ > :not(:last-child) {
      margin-bottom: 16px;
    }
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
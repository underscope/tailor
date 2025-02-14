<template>
  <div class="activities-container">
    <div class="loader-outer">
      <div class="loader-inner">
        <v-progress-circular v-if="showLoader" color="primary" indeterminate />
      </div>
    </div>
    <div :style="{ visibility }" class="activities">
      <tree-graph
        @node:select="onNodeSelect"
        v-bind="graphOptions"
        :data="graphData"
        class="tree" />
      <sidebar />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import Sidebar from 'components/course/Sidebar';
import TreeGraph from './TreeGraph';

const isActivityNode = node => node.depth > 0;

const graphOptions = {
  nodeSize: { width: 60, height: 180 },
  nodeDiameterRange: { min: 8, max: 14 }
};

export default {
  name: 'tree-view',
  props: {
    showLoader: { type: Boolean, default: false }
  },
  data() {
    return {
      graphOptions,
      selectedNode: null
    };
  },
  computed: {
    ...mapGetters('course', ['activities', 'course', 'structure']),
    // TODO: Remove this hack!
    visibility() {
      return this.showLoader ? 'hidden' : 'visible';
    },
    graphData() {
      // TODO: Make sure course is always available!
      if (!this.course) return {};
      const allowedTypes = map(this.structure, 'type');
      const activities = filter(this.activities, it => {
        return includes(allowedTypes, it.type);
      });
      const courseTree = tree(activities, this.structure);
      const courseColor = get(this.course, 'data.color', '#FFFFFF');
      return Object.assign({}, this.course, { color: courseColor }, courseTree);
    }
  },
  methods: {
    ...mapMutations('course', ['focusActivity']),
    setSelected(node) {
      if (this.selectedNode) this.selectedNode.classList.remove('selected');
      this.selectedNode = node;
      this.selectedNode.classList.add('selected');
    },
    onNodeSelect(node, activity, circle) {
      if (!isActivityNode(node)) return;
      this.setSelected(circle);
      this.focusActivity(activity._cid);
    }
  },
  components: {
    Sidebar,
    TreeGraph
  }
};

function tree(activities, structure, root = { size: 0 }, parent = root, depth = 0) {
  if (depth > root.size) root.size = depth;
  parent.children = reduce(activities, (acc, it) => {
    const parentId = parent.id || null;
    if (it.parentId !== parentId) return acc;
    it.color = getColor(it.type, structure);
    const subtree = tree(activities, structure, root, { ...it }, depth + 1);
    acc.push(subtree);
    return acc;
  }, []);
  return parent;
}

function getColor(type, structure) {
  const desc = find(structure, { type });
  return desc && desc.color;
}
</script>

<style lang='scss' scoped>
$accent: #337ab7;

.loader-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .loader-inner {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: inherit;
  }
}

.activities-container {
  position: relative;
  height: 100%;
}

.activities {
  position: relative;
  height: 100%;
  padding-right: 400px;
}

.tree {
  width: 100%;
  height: 100%;
  float: left;
}

.tree /deep/ {
  .selected {
    .circle-wrapper {
      filter: url(#lighten);
    }

    .circle {
      filter: url(#drop-shadow);
    }

    .label {
      fill: $accent;
      font-weight: bold;
    }
  }

  .node .circle-wrapper:hover .circle {
    filter: url(#drop-shadow);
  }

  // Disable all effects on root/course node.
  .depth-0 .circle-wrapper {
    * {
      cursor: auto;
    }

    &:hover .circle {
      filter: none;
    }
  }
}
</style>

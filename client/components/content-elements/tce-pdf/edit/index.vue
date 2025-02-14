<template>
  <div class="tce-pdf">
    <div v-show="showPlaceholder">
      <div class="well pdf-placeholder">
        <div class="message">
          <span class="heading">Pdf placeholder</span>
          <span v-if="!isFocused">Select to edit</span>
          <span v-else>Please use toolbar to enter url</span>
        </div>
      </div>
    </div>
    <div v-show="!showPlaceholder">
      <div v-if="!isFocused" class="overlay">
        <div class="message">Click to preview</div>
      </div>
      <div class="loader-outer">
        <div class="loader-inner">
          <circular-progress v-show="!showError" />
        </div>
      </div>
      <div class="pdf-container">
        <div
          v-show="showViewer"
          ref="pdf"
          class="pdf">
        </div>
        <img
          v-if="safari"
          v-show="false"
          @error="showViewer = false"
          :src="source.src">
        <div v-show="showError" class="error">
          <div class="message">
            <span class="icon mdi mdi-alert"></span>
            <p>Error loading PDF file!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircularProgress from './CircularProgress';
import get from 'lodash/get';
import isIE from 'is-iexplorer';
import isSafari from 'is-safari';

const ERR_TIMEOUT = 10000;
const TYPE = 'application/pdf';

export default {
  name: 'tce-pdf',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false }
  },
  data() {
    return {
      showError: false,
      showViewer: true
    };
  },
  computed: {
    source() {
      const src = get(this.element, 'data.url');
      if (!src) return;
      return { type: TYPE, src };
    },
    showPlaceholder() {
      return !this.source;
    },
    safari() {
      return isSafari;
    },
    showElement() {
      return !isIE || this.isFocused;
    }
  },
  methods: {
    createObject() {
      const pdfObject = document.createElement('object');
      pdfObject.data = this.source.src;
      pdfObject.type = this.source.type;
      this.pdfObject = this.$refs.pdf.appendChild(pdfObject);
      setTimeout(() => (this.showError = true), ERR_TIMEOUT);
    },
    embedPdf() {
      if (!this.source) return;
      if (this.pdfObject) this.pdfObject.remove();
      this.createObject();
    }
  },
  watch: {
    'element.data.url'() {
      this.showViewer = true;
      this.showError = false;
      this.embedPdf();
    }
  },
  mounted() {
    this.embedPdf();
    this.$elementBus.on('save', ({ data }) => this.$emit('save', data));
  },
  beforeDestroy() {
    this.pdfObject = null;
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.tce-pdf {
  position: relative;
}

.pdf-placeholder {
  .message {
    padding: 100px;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.overlay {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: #333;
  opacity: 0.9;

  .message {
    position: relative;
    top: 45%;
    color: #008000;
    font-size: 22px;
  }
}

.error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  z-index: 1;
}

.error .message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;

  .icon { font-size: 42px; }
}

.well {
  margin: 0;
}

.pdf-container {
  position: relative;
  height: 360px;
}

.pdf {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  .ie & {
    background: #585858;
  }

  /deep/ object {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.loader-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .loader-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import {
  adjustForWildcards,
  findNearbyHighlights,
  getWildcardHighlights,
  isHighlightValid,
  removeWildcardKeyword,
  safelyRemove,
  trimHighlight,
  updateHighlight
} from './helpers';
import forEachRight from 'lodash/forEachRight';
import Highlight from './Highlight';
import inRange from 'lodash/inRange';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';

export default class Highlights {
  constructor(items = [], wildcards = []) {
    this.items = items;
    this.wildcards = wildcards;
  }

  get highlights() {
    const highlights = filter(this.items, it => !it.isWildcard);
    return sortBy(highlights, highlight => highlight.start);
  }

  toPlainObjects() {
    let highlights = this.highlights.map(it => it.toPlainObject());
    this.wildcards.forEach(it => highlights.push(Highlight.toWildcardObject(it)));

    return highlights;
  }

  equals(other) {
    return isEqual(this.items, other.items) &&
      isEqual(this.wildcards, other.wildcards);
  }

  update(other) {
    if (this.equals(other)) return this;

    if (!isEqual(this.items, other.items)) this.items = cloneDeep(other.items);
    if (!isEqual(this.wildcards, other.wildcards)) {
      this.wildcards = cloneDeep(other.wildcards);
    }

    return this;
  }

  addWildcard(wildcard, text) {
    if (!wildcard || !text) return;
    if (!text.includes(wildcard)) return;
    if (this.wildcards.includes(wildcard)) return;

    this.wildcards.push(wildcard);
    getWildcardHighlights(wildcard, text).forEach(it => this.addHighlight(it));
  }

  addHighlight(highlight) {
    if (findIndex(this.items, highlight) !== -1) return;

    const nearby = findNearbyHighlights(highlight, this.items);
    const { inner, outer, containing } = nearby;
    if (containing) return;

    trimHighlight({ highlight, isAdding: true }, outer, this.wildcards);

    const outerHighlights = isEmpty(outer) ? [] : Object.values(outer);
    this.removeHighlights(inner.concat(outerHighlights));

    this.items.push(highlight);
  }

  removeWildcard(wildcard) {
    if (!wildcard) return;
    if (!this.wildcards.includes(wildcard)) return;

    const shouldRemove = it => it.isWildcard && it.text === wildcard;
    this.removeHighlights(filter(this.items, it => shouldRemove(it)));

    removeWildcardKeyword(wildcard, this.wildcards);
  }

  removeHighlight(highlight) {
    this.remove(highlight);

    if (!highlight.isWildcard) {
      // restore the wildcard(s) formerly overshadowed by the highlight
      return this.wildcards.forEach(wildcard => {
        const index = highlight.text.indexOf(wildcard);
        if (index === -1) return;
        const start = highlight.start + index;
        this.addHighlight(new Highlight(start, wildcard, true));
      });
    }
  }

  remove(highlight) {
    const index = findIndex(this.items, highlight);
    if (index !== -1) return safelyRemove(this.items, index, this.wildcards);

    const nearby = findNearbyHighlights(highlight, this.items);
    const { inner, outer, containing } = nearby;

    if (containing) {
      if (highlight.isWildcard) return;

      let split = containing.splitBy(highlight, this.wildcards);
      split = split.map(it => adjustForWildcards(it, this.wildcards));
      this.removeHighlights([containing, highlight]);

      return this.items.push(...split);
    }

    trimHighlight({ highlight, isAdding: false }, outer, this.wildcards);
    this.removeHighlights(inner);
  }

  removeHighlights(highlights) {
    highlights.forEach(it => this.remove(it));
  }

  findByTextIndex(index) {
    const highlight = find(this.highlights, it => {
      return inRange(index, it.start, it.end + 1);
    });
    return highlight || null;
  }

  updateForText(text, change) {
    forEachRight(this.items, it => {
      if (it.end < change.start) return;
      if (isHighlightValid(it, text)) return;
      if (updateHighlight(it, text, change)) return;
      this.removeHighlight(it);
    });
  }
}

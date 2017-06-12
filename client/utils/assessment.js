import cuid from 'cuid';
import dropRight from 'lodash/dropRight';
import find from 'lodash/find';
import get from 'lodash/get';
import last from 'lodash/last';
import map from 'lodash/map';
import times from 'lodash/times';
import toPairs from 'lodash/toPairs';
import toPath from 'lodash/toPath';
import yup from 'yup';

export const typeInfo = {
  MC: { type: 'MC', title: 'Multiple choice', class: 'multiple-choice' },
  SC: { type: 'SC', title: 'Single choice', class: 'single-choice' },
  TR: { type: 'TR', title: 'Text response', class: 'text-response' },
  NR: { type: 'NR', title: 'Numerical response', class: 'numerical-response' },
  TF: { type: 'TF', title: 'True - false', class: 'true-false' },
  FB: { type: 'FB', title: 'Fill in the blank', class: 'fill-blank' },
  MQ: { type: 'MQ', title: 'Matching question', class: 'matching-question' },
  DD: { type: 'DD', title: 'Drag & Drop', class: 'drag-drop' }
};

export const helperText = {
  FB: { question: 'Type "@blank" when new blank is needed.' }
};

const BLANK_PLACEHOLDER = /(@blank)/g;

function containsText(asset) {
  return asset.type === 'HTML' &&
    asset.data.content &&
    asset.data.content.trim().length > 0;
}

function containsBlanks(asset) {
  return asset.data.content.match(BLANK_PLACEHOLDER);
}

const question = yup.array().test(
  'has-text', 'Please define question', question => !!find(question, containsText)
);

const fbQuestion = yup.array().test(
  'has-blanks', 'At least one @blank required', question => {
    return !!find(question, it => containsText(it) && containsBlanks(it));
  }
);

const hint = yup.string().trim().max(200);

const objectMap = yup.object().shape({
  key: yup.string().required(),
  value: yup.string().required()
});

yup.addMethod(yup.array, 'castMap', function () {
  return this.transform(function (value, originalValue) {
    if (this.isType(value)) return value;
    return map(toPairs(originalValue), it => ({ key: it[0], value: it[1] }));
  });
});

export const schemas = {
  MC: yup.object().shape({
    question,
    answers: yup.array().min(2).of(yup.string().trim().min(1).max(200)).required(),
    correct: yup.array().min(1).of(yup.number()).required(),
    hint
  }),
  NR: yup.object().shape({
    question,
    correct: yup.string().trim().matches(/^(-?\d+(\.\d+)?)$/).max(200).required(),
    hint
  }),
  SC: yup.object().shape({
    question,
    answers: yup.array().min(2).of(yup.string().trim().min(1).max(200).required()).required(),
    correct: yup.number().required(),
    hint
  }),
  TR: yup.object().shape({
    question,
    correct: yup.string().trim().min(1).max(7000).required(),
    hint
  }),
  TF: yup.object().shape({
    question,
    correct: yup.boolean().required(),
    hint
  }),
  FB: yup.object().shape({
    question: fbQuestion,
    correct: yup.array().of(yup.array().min(1).of(yup.string().trim().min(1).max(200).required())),
    hint
  }),
  MQ: yup.object().shape({
    question,
    correct: yup.array().of(yup.object().shape({
      premise: yup.string().trim().notOneOf(['Click to edit']).required(),
      response: yup.string().trim().notOneOf(['Click to edit']).required()
    })).min(2).required(),
    headings: yup.object().shape({
      premise: yup.string().trim().min(1).max(50).required(),
      response: yup.string().trim().min(1).max(50).required()
    })
  }),
  DD: yup.object().shape({
    question,
    hint,
    groups: yup.array().castMap().of(objectMap).min(2),
    answers: yup.array().castMap().of(objectMap),
    correct: yup.array().castMap().of(yup.object().shape({
      key: yup.string().required(),
      value: yup.array().of(yup.string().required()).min(1)
    })).min(1)
  })
};

export function errorProcessor(error) {
  let item = error.value;
  if (item.type !== 'DD') return map(error.inner, it => it.path);
  // TODO: Nasty !!
  return map(error.inner, it => {
    let path = toPath(it.path);
    if (path.length === 1) return it.path;
    if (last(path) !== 'value') return;
    let key = get(error.value, dropRight(path).concat('key'));
    return `${path[0]}${key}`;
  });
}

export const defaults = {
  MC: {
    type: 'MC',
    question: [],
    answers: ['', '', ''],
    correct: [],
    hint: ''
  },
  NR: {
    type: 'NR',
    question: [],
    correct: '',
    hint: ''
  },
  SC: {
    type: 'SC',
    question: [],
    answers: ['', ''],
    correct: '',
    hint: ''
  },
  TR: {
    type: 'TR',
    question: [],
    correct: '',
    hint: ''
  },
  TF: {
    type: 'TF',
    question: [],
    correct: null,
    hint: ''
  },
  FB: {
    type: 'FB',
    question: [],
    correct: []
  },
  MQ: {
    type: 'MQ',
    question: [],
    correct: [],
    hint: '',
    headings: {
      premise: 'Premise',
      response: 'Response'
    }
  },
  DD() {
    let element = {
      type: 'DD',
      question: [],
      groups: {},
      answers: {},
      correct: {},
      hint: ''
    };
    times(2, () => {
      const groupKey = cuid();
      const answerKey = cuid();
      element.groups[groupKey] = '';
      element.answers[answerKey] = '';
      element.correct[groupKey] = [answerKey];
    });
    return element;
  }
};

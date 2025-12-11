import jsVariables from './javascript/variables.json';
import jsOperators from './javascript/operators.json';
import jsConditionals from './javascript/conditionals.json';
import jsLoops from './javascript/loops.json';
import jsFunctions from './javascript/functions.json';
import jsArrays from './javascript/arrays.json';
import jsObjects from './javascript/objects.json';
import jsHOF from './javascript/higher-order.json';
import jsStruct from './javascript/data-structures.json';
import jsSearchSort from './javascript/searching-sorting.json';
import jsString from './javascript/string-logic.json';
import jsFPConcepts from './javascript/fp-concepts.json';
import jsFPPatterns from './javascript/fp-patterns.json';
import jsFPProcessing from './javascript/fp-processing.json';
import jsWebHTML from './javascript/web-html.json';
import jsWebCSS from './javascript/web-css.json';

import pyBasics from './python/basics.json';
import pyLoops from './python/loops.json';
import pyModules from './python/modules.json';
import pyFunctions from './python/functions.json';
import pyStruct from './python/data-structures.json';

export const allChallenges = [
  ...jsVariables,
  ...jsOperators,
  ...jsConditionals,
  ...jsLoops,
  ...jsFunctions,
  ...jsArrays,
  ...jsObjects,
  ...jsHOF,
  ...jsStruct,
  ...jsSearchSort,
  ...jsString,
  ...jsFPConcepts,
  ...jsFPPatterns,
  ...jsFPProcessing,
  ...jsWebHTML,
  ...jsWebCSS,
  ...pyBasics,
  ...pyLoops,
  ...pyModules,
  ...pyFunctions,
  ...pyStruct
];
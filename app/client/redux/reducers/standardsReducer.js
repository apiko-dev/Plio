import {
  initSections,
  initTypes,
  initStandards,
} from '../lib/standardsHelpers';

import {
  INIT_SECTIONS,
  SET_SECTIONS,
  SET_STANDARDS,
  INIT_TYPES,
  SET_TYPES,
  INIT_STANDARDS,
  SET_IS_CARD_READY,
  SET_FILTERED_STANDARDS,
  SET_IS_FULL_SCREEN_MODE,
  SET_STANDARD_DEPS_READY,
  SET_STANDARDS_INITIALIZING,
} from '../actions/types';

const initialState = {
  sections: [],
  types: [],
  standards: [],
  standardsFiltered: [],
  isCardReady: false,
  isFullScreenMode: false,
  areDepsReady: false,
  initializing: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SECTIONS:
    case SET_STANDARDS:
    case SET_TYPES:
    case SET_IS_CARD_READY:
    case SET_FILTERED_STANDARDS:
    case SET_IS_FULL_SCREEN_MODE:
    case SET_STANDARD_DEPS_READY:
    case SET_STANDARDS_INITIALIZING:
      return { ...state, ...action.payload };
    case INIT_SECTIONS:
      return { ...state, sections: initSections(action.payload) };
    case INIT_TYPES:
      return { ...state, types: initTypes(action.payload) };
    case INIT_STANDARDS:
      return { ...state, standards: initStandards(action.payload) };
    default:
      return state;
  }
}

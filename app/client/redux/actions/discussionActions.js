import {
  SET_MESSAGES,
  SET_LOADING,
  SET_LIMIT,
  SET_SORT,
  SET_AT,
  RESET,
  SET_LAST_MESSAGE_ID,
  SET_SHOULD_SCROLL_TO_BOTTOM
} from './types';
import { initialState } from '../reducers/discussionReducer';

export function setMessages(messages) {
  return {
    type: SET_MESSAGES,
    payload: messages
  }
}

export function setLoading(bool) {
  return {
    type: SET_LOADING,
    payload: bool
  }
}

export function setLimit(limit) {
  return {
    type: SET_LIMIT,
    payload: limit
  }
}

export function setSort(sort) {
  return {
    type: SET_SORT,
    payload: sort
  }
}

export function setAt(at) {
  return {
    type: SET_AT,
    payload: at
  }
}

export function reset() {
  return {
    type: RESET,
    payload: initialState
  }
}

export function setLastMessageId(id) {
  return {
    type: SET_LAST_MESSAGE_ID,
    payload: id
  }
}

export function setShouldScrollToBottom(bool) {
  return {
    type: SET_SHOULD_SCROLL_TO_BOTTOM,
    payload: bool
  }
}

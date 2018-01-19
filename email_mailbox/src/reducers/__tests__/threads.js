/* eslint-env node, jest */

import threadsReducer from '../thread';
import * as actions from '../../actions/index';
import file from './../../../public/threads.json';
const myThreads = file.threads;

describe('thread actions', () => {
  const threads = [myThreads[0]];
  const manyThreads = [myThreads[0], myThreads[1]];

  function initState(threads) {
    return threadsReducer(undefined, actions.addThreads(threads));
  }

  it('should add threads to state', () => {
    expect(initState(manyThreads)).toMatchSnapshot();
  });

  it('should set thread as read', () => {
    const state = initState(threads);
    const action = actions.selectThread(0);
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('should set thread as selected', () => {
    const state = initState(threads);
    const action = actions.multiSelectThread(23, true);
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('should add label Starred', () => {
    const state = initState(threads);
    const action = actions.addThreadLabel(23, 1);
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('should remove label Starred', () => {
    const state = initState(threads);
    const action = actions.removeThreadLabel(23, 1);
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('should set all threads as selected', () => {
    const state = initState(manyThreads);
    const action = actions.selectThreads();
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('should set all threads as not selected', () => {
    const state = initState(manyThreads);
    const action = actions.deselectThreads();
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('should add label 1 to threads', () => {
    const state = initState(manyThreads);
    const action = actions.addThreadsLabel([23, 13], 1);
    const newState = threadsReducer(state, action);
    expect(newState).toMatchSnapshot();
  });
});
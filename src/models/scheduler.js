import { getSchedulerList, stopRunningJob } from '@/services/scheduler';

export default {
  namespace: 'scheduler',

  state: {},

  effects: {
    * fetchList(_, { call, put }) {
      const response = yield call(getSchedulerList);
      yield put({
        type: 'updateSchedulerList',
        payload: response.data,
      });
    },
    * stopJob ({ id }, { call }) {
      yield call(stopRunningJob, id);
    },
  },

  reducers: {
    updateSchedulerList(state, action) {
      return {
        ...state,
        schedulerList: action.payload,
      };
    },
  },
};

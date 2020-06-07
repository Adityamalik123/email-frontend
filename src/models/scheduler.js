import { getSchedulerList } from '@/services/scheduler';

export default {
  namespace: 'scheduler',

  state: {},

  effects: {
    * fetchList(bot, { call, put }) {
      const response = yield call(getSchedulerList);
      yield put({
        type: 'updateSchedulerList',
        payload: response.data,
      });
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

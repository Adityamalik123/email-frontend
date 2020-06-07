import {
  queryCurrent,
} from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {

    *fetchCurrent(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { loading: true },
      });
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { loading: false },
      });
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload.data || {} };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading,
      };
    },
  },
};
export default UserModel;

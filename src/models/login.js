import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { accountLogin, logout } from '@/services/login';
// import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      if (response.success === true) {
        yield put(routerRedux.replace('/'));
      } else {
        message.error('Wrong username/password')
      }
    },

    *logout(_, { put, call }) {
      const { redirect } = getPageQuery(); // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
      yield call(logout);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status === 200, type: payload.type };
    },
  },
};
export default Model;

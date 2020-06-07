import {
  botListAPI,
  botCountAPI,
  createBot,
  resetPasswordOfDifferentAccount,
  getResetPasswordLinks,
  getSuperAdminByBot,
  swapSuperAdmin,
} from '@/services/bot';

const GlobalModel = {
  namespace: 'bot',
  state: {
    collapsed: false,
    notices: [],
  },
  effects: {
    *fetchResetPasswordLinks(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { loading: true },
      });
      const data = yield call(getResetPasswordLinks);
      yield put({
        type: 'saveResetLinks',
        payload: { data },
      });
      yield put({
        type: 'changeLoading',
        payload: { loading: false },
      });
    },
    *fetchBotList({ pageNumber }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { loading: true },
      });
      const data = yield call(botListAPI, pageNumber);
      yield put({
        type: 'saveBotList',
        payload: { data },
      });
      yield put({
        type: 'changeLoading',
        payload: { loading: false },
      });
    },
    *fetchBotCount(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { loading: true },
      });
      const data = yield call(botCountAPI);
      yield put({
        type: 'saveBotCount',
        payload: { data },
      });
      yield put({
        type: 'changeLoading',
        payload: { loading: false },
      });
    },
    *createBot({ payload, botList }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { loading: true },
      });
      const data = yield call(createBot, payload);
      if (data.botId && data.botName) {
        botList.unshift(data);
        yield put({
          type: 'saveBotList',
          payload: { botList },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { loading: false },
      });
    },
    *resetPassword({ payload, resetLinks }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { loading: true },
      });
      const response = yield call(resetPasswordOfDifferentAccount, payload);
      if (response.email) {
        resetLinks.unshift(response);
      }
      yield put({
        type: 'resetPasswordResponse',
        payload: { response, resetLinks },
      });
      yield put({
        type: 'changeLoading',
        payload: { loading: false },
      });
    },
    *getSuperAdminUser({ payload }, { call, put }) {
      if (payload === null) {
        yield put({
          type: 'changeSuperAdminDetails',
          payload,
        });
      } else {
        yield put({
          type: 'changeLoading',
          payload: { apiLoading: true },
        });
        const response = yield call(getSuperAdminByBot, payload);
        if (!response.success) {
          yield put({
            type: 'changeSuperAdminDetails',
            payload: {
              data: null,
              failed: true,
              message:
                response.data && response.data.message ? response.data.message : response.data,
            },
          });
        } else {
          yield put({
            type: 'changeSuperAdminDetails',
            payload: {
              data: response.data && response.data.length > 0 ? response.data[0] : null,
            },
          });
        }
        yield put({
          type: 'changeLoading',
          payload: { apiLoading: false },
        });
      }
    },
    *swapSuperAdminAccounts({ payload, superAdminDetails }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { apiLoading: true },
      });
      const response = yield call(swapSuperAdmin, payload);
      if (!response.success) {
        yield put({
          type: 'changeSuperAdminDetails',
          payload: {
            data: superAdminDetails.data,
            failed: true,
            message: response.data && response.data.message ? response.data.message : response.data,
          },
        });
      } else {
        yield put({
          type: 'changeSuperAdminDetails',
          payload: {
            data: superAdminDetails.data,
            success: true,
            message: response.data,
          },
        });
      }
      yield put({
        type: 'changeLoading',
        payload: { apiLoading: false },
      });
    },
  },
  reducers: {
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.loading || false,
        apiLoading: payload.apiLoading || false,
      };
    },
    resetPasswordResponse(state, { payload }) {
      return {
        ...state,
        resetPasswordResponse: payload.response,
        resetPasswordLinks: payload.resetLinks,
      };
    },
    saveBotList(
      state,
      {
        payload: { data },
      },
    ) {
      return {
        ...state,
        botList: data.success === false || data.status ? undefined : data,
      };
    },
    saveBotCount(
      state,
      {
        payload: { data },
      },
    ) {
      return {
        ...state,
        botCount: data || 0,
      };
    },
    saveResetLinks(
      state,
      {
        payload: { data },
      },
    ) {
      return {
        ...state,
        resetPasswordLinks: data && data.length > 0 ? data : undefined,
      };
    },
    changeSuperAdminDetails(state, { payload }) {
      return {
        ...state,
        superAdminDetails:
          payload === null
            ? null
            : {
                data: payload.data,
                failed: payload.failed,
                message: payload.message,
                success: payload.success,
              },
      };
    },
  },
};
export default GlobalModel;

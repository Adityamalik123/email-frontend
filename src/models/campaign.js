import { message } from 'antd';
import { fetchList, createOrUpdateCampaign, fetchById, pushJob } from '@/services/campaign';
import { getMeta, getAudienceData } from '@/services/audience';

const Model = {
  namespace: 'campaign',
  state: { },
  effects: {
    * fetchAll({ payload }, { call, put }) {
      yield put({
        type: 'changeDataLoading',
        dataLoading: true,
      });
      const response = yield call(fetchList, payload);
      if (response.success) {
        yield put({
          type: 'changeSettings',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeSettings',
          payload: [],
        });
      }
      yield put({
        type: 'changeDataLoading',
        dataLoading: false,
      });
    },
    * createOrUpdate({ payload, data }, { call, put }) {
      yield put({
        type: 'changeDataLoading',
        dataLoading: true,
      });
      const response = yield call(createOrUpdateCampaign, payload);
      if (response.success) {
        data.unshift(response.data);
        yield put({
          type: 'changeSettings',
          payload: data,
        });
      } else {
        message.error('Error occured, Please try again..');
        yield put({
          type: 'changeSettings',
          payload: data,
        });
      }
      yield put({
        type: 'changeDataLoading',
        dataLoading: false,
      });
    },
    * fetchAudience({ payload }, { put, call }) {
      const audience = yield call(getMeta, payload);
      yield put({
        type: 'changeAudience',
        payload: audience.data,
      });
    },
    * getAudienceData({ payload }, { put, call }) {
      const audienceData = yield call(getAudienceData, payload);
      yield put({
        type: 'changeAudienceData',
        payload: audienceData.data,
      });
    },
    * fetchInfo({ payload }, { call, put }) {
      yield put({
        type: 'changeDataLoading',
        dataLoading: true,
      });
      const response = yield call(fetchById, payload);
      if (response.success) {
        yield put({
          type: 'changeCampaign',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeCampaign',
          payload: {},
        });
      }
      yield put({
        type: 'changeDataLoading',
        dataLoading: false,
      });
    },
    * createJob({ payload }, { call }) {
      yield call(pushJob, payload);
    },
    * updateCampaigns({ payload }, { call, put }) {
      yield put({
        type: 'changeDataLoading',
        dataLoading: true,
      });
      const response = yield call(createOrUpdateCampaign, payload);
      if (response.success) {
        yield put({
          type: 'changeCampaign',
          payload: response.data,
        });
      } else {
        yield put({
          type: 'changeCampaign',
          payload: {},
        });
      }
      yield put({
        type: 'changeDataLoading',
        dataLoading: false,
      });
    },
  },
  reducers: {
    changeSettings(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    changeDataLoading(state, { dataLoading }) {
      return {
        ...state,
        dataLoading,
      };
    },
    changeCampaign(state, { payload }) {
      return {
        ...state,
        campaignInfo: payload,
      };
    },
    changeAudience(state, payload) {
      return {
        ...state,
        audience: payload.payload,
      };
    },
    changeAudienceData(state, payload) {
      return {
        ...state,
        audienceData: payload.payload,
      };
    },
  },
};
export default Model;

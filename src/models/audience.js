import _ from 'lodash';
import { message } from 'antd';
import { createAudience, getMeta, getAudienceData, getMetaById, uploadAudienceData } from '@/services/audience';

const Model = {
  namespace: 'audience',
  state: {
    status: undefined,
  },
  effects: {
    * getAllAudiences({ limit, page }, { call, put }) {
      yield put({
        type: 'changeLoading',
        loading: true,
      });
      const response = yield call(getMeta);
      if (response.success && response.data.length > 0) {
        const requestObject = {};
        requestObject.tableName = _.get(response, 'data[0].name');
        requestObject.audienceId = _.get(response, 'data[0]._id');
        requestObject.page = page || 1;
        requestObject.limit = limit;
        const records = yield call(getAudienceData, requestObject);
        const responseData = {
          current: _.get(response, 'data[0]'),
          data: (records.data && records.data.docs) || [],
          tableName: requestObject.tableName,
          count: records.data && records.data.totalDocs,
          page: requestObject.page,
          limit: requestObject.limit,
        };
        yield put({
          type: 'refreshTable',
          payload: responseData,
        });
      } else {
        yield put({
          type: 'refreshTable',
          payload: {},
        });
      }
      yield put({
        type: 'changeAudience',
        payload: response.data,
      });
      yield put({
        type: 'changeLoading',
        loading: false,
      });
    },
    * createAudience({ payload }, { call, put }) {
      const response = yield call(createAudience, payload);
      const current = response.data || payload.tableObject;
      const { name } = payload;
      const requestObject = {};
      requestObject.tableName = name;
      // eslint-disable-next-line no-underscore-dangle
      requestObject.audienceId = current._id;
      requestObject.page = 1;
      requestObject.limit = payload.limit;
      const records = yield call(getAudienceData, requestObject);
      const metaResponse = yield call(getMeta);
      yield put({
        type: 'changeAudience',
        payload: metaResponse.data,
      });
      const responseData = {
        current,
        data: (records.data && records.data.docs) || [],
        tableName: requestObject.tableName,
        count: records.data && records.data.totalDocs,
        page: requestObject.page,
        limit: requestObject.limit,
      };
      yield put({
        type: 'refreshTable',
        payload: responseData,
      });
    },
    * handleChangeAudience({ payload: { audienceId, page, limit } }, { call, put }) {
      yield put({
        type: 'changeDataLoading',
        dataLoading: true,
      });
      if (audienceId) {
        const selected = yield call(getMetaById, { audienceId });
        yield put({
          type: 'refreshTable',
          payload: {
            tableName: _.get(selected, 'data.name'),
            current: selected.data,
          },
        });
        const requestObject = {};
        requestObject.tableName = _.get(selected, 'data.name');
        requestObject.audienceId = audienceId;
        requestObject.page = page || 1;
        requestObject.limit = limit || '10';
        const records = yield call(getAudienceData, requestObject);
        const responseData = {
          current: selected.data,
          data: (records.data && records.data.docs) || [],
          tableName: requestObject.tableName,
          count: records.data && records.data.totalDocs,
          page: requestObject.page,
          limit: requestObject.limit,
        };
        yield put({
          type: 'refreshTable',
          payload: responseData,
        });
        yield put({
          type: 'changeDataLoading',
          dataLoading: false,
        });
      }
    },
    * uploadData({ payload: { payload, current } }, { call, put }) {
      yield put({
        type: 'changeDataLoading',
        dataLoading: true,
      });
      yield call(uploadAudienceData, payload);
      message.success('File has been uploaded successfully, It may take some time for data to appear.');
      const requestObject = {};
      requestObject.tableName = payload.table;
      requestObject.audienceId = payload.audienceId;
      requestObject.page = 1;
      requestObject.limit = '10';
      const records = yield call(getAudienceData, requestObject);
      const responseData = {
        current,
        data: (records.data && records.data.docs) || [],
        tableName: requestObject.tableName,
        count: records.data && records.data.totalDocs,
        page: requestObject.page,
        limit: requestObject.limit,
      };
      yield put({
        type: 'refreshTable',
        payload: responseData,
      });
      yield put({
        type: 'changeDataLoading',
        dataLoading: false,
      });
    },

  },
  reducers: {
    refreshTable(state, { payload }) {
      return {
        ...state,
        records: payload.data,
        current: payload.current,
        tableName: payload.tableName,
        count: payload.count,
        page: payload.page,
        limit: payload.limit,
      };
    },
    changeAudience(state, { payload }) {
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
    changeLoading(state, { loading }) {
      return {
        ...state,
        loading,
      };
    },
  },
};
export default Model;

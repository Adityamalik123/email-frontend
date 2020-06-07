import request from '@/utils/request';

export async function createAudience(params) {
  return request('/api/backend/audience/create', {
    method: 'POST',
    data: params,
  });
}

export async function getMeta() {
  return request('/api/backend/audience/getMeta');
}

export async function getAudienceData({ audienceId, page, limit }) {
  return request(`/api/backend/audience/records/${audienceId}/${page}-${limit}`);
}

export async function getMetaById(params) {
  return request(`/api/backend/audience/getMetaById/${params.audienceId}`);
}

export async function uploadAudienceData(payload) {
  return request('/api/backend/audience/upload-data', {
    method: 'POST',
    data: payload,
  });
}

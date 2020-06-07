import request from '@/utils/request';

export async function createOrUpdateCampaign(params) {
  return request('/api/backend/campaign/createOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function fetchList() {
  return request('/api/backend/campaign/getList');
}

export async function fetchById(payload) {
  return request(`/api/backend/campaign/get?campaignId=${payload.campaignId}`);
}

export async function pushJob(params) {
  return request('/api/backend/campaign/send-notification', {
    method: 'POST',
    data: params,
  });
}

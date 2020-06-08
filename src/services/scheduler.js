import request from '@/utils/request';

export async function getSchedulerList() {
  return request('/api/backend/scheduler/getList');
}

export async function stopRunningJob(id) {
  return request(`/api/backend/scheduler/stopJob?id=${id}`);
}

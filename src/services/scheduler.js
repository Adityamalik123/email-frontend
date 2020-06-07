import request from '@/utils/request';

export async function getSchedulerList() {
  return request('/api/backend/scheduler/getList');
}

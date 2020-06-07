import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/backend/login', {
    method: 'POST',
    data: params,
  });
}

export async function logout() {
  return request('/api/backend/user/logout');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

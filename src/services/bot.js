import request from '@/utils/request';

export async function botListAPI(pageNumber) {
  return request(`/api/admin/bot/bot-list?pageNumber=${pageNumber || 0}`);
}

export async function botCountAPI() {
  return request('/api/admin/bot/bot-count');
}

export async function getResetPasswordLinks() {
  return request('/api/admin/bot/reset-password-links');
}

export async function createBot(values) {
  return request('/api/admin/bot/create', {
    method: 'post',
    data: values,
  });
}

export async function resetPasswordOfDifferentAccount(values) {
  return request(`/api/admin/bot/password-reset-link?usernameOrEmail=${values.usernameOrEmail}`);
}

export async function getSuperAdminByBot(values) {
  return request(`/api/admin/bot/get-superadmin-by-bot?bot=${values.botId}`);
}

export async function swapSuperAdmin(values) {
  return request('/api/admin/bot/replace-roles', {
    method: 'post',
    data: values,
  });
}

export async function swapSuperAdminVerifyToken(token) {
  return request(`/api/admin/auth/general/verify-token?token=${token}`);
}

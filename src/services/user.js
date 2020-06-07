import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/backend/user/getLoggedInUser');
}

export async function usersList(enabled) {
  return request(`/api/admin/users/list-users?enabled=${enabled}`);
}

export async function resendVerificationMail(userDetails) {
  return request('/api/admin/users/resend', {
    method: 'POST',
    data: userDetails,
  });
}

export async function verifyToken(body) {
  return request('/api/admin/auth/verify-token', {
    method: 'POST',
    data: body,
  });
}

export async function sendResetEmail({ email }) {
  return request(`/api/admin/auth/reset-password?email=${email}`);
}

export async function resetPassword(body) {
  return request('/api/admin/auth/reset-password', {
    method: 'POST',
    data: body,
  });
}

export async function deleteUser({ payload: { email }, enabled }) {
  return request(`/api/admin/users/delete-user/${email}?enabled=${enabled}`, {
    method: 'DELETE',
  });
}

export async function addUser({ payload }) {
  payload.username = payload.email.replace(/[@.]/g, '');
  return request('/api/admin/users/add-user', {
    method: 'POST',
    data: payload,
  });
}

export async function getRoles() {
  return request('/api/admin/users/get-authorities');
}

export async function queryNotices() {
  return request('/api/notices');
}

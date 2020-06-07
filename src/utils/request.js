/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: 'Login success',
  400: 'Invalid Parameter or Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden ',
  404: 'Not found',
  409: 'User already exist',
  500: 'Internal Error',
  503: 'Backend Error',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response, data } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;

    notification.error({
      message: `Request failed with ${status}`,
      description: data.message || errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'We encountered an error',
      message: 'Server encountered an error while fulfilling your request, please try again.',
    });
  }

  if (response.status === 401) {
    window.location.href = '/user/login';
  }

  return data;
};

/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});
export default request;

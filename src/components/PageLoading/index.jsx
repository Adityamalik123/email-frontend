import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd'; // loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const PageLoading = () => (
  <div
    style={{
      paddingTop: 100,
      textAlign: 'center',
    }}
  >
    <Spin size="large" indicator={antIcon} />
  </div>
);

export default PageLoading;

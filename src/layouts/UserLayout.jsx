import React from 'react';
import { connect } from 'dva';

const UserLayout = props => {
  const {
    children,
  } = props;
  return (
    <>
      {children}
    </>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);

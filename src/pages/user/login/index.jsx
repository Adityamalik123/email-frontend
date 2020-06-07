import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './style.less';

@connect(({ login, loading, user }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  currentUser: user,
}))
@Form.create()
class Login extends Component {
  state = {
  };

  onFinish = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: values,
        });
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { userLogin, submitting } = this.props;
    // const { status } = userLogin;
    // const { type } = this.state;
    return (
      <Row>
        <Col className={styles.image} span={12}>
          <img alt="logo" src="https://app.zestmoney.in/assets/images/authentication/welcome-image.svg" />
        </Col>
        <Col className={styles.form} span={12}>
          <Form
            style={{ width: '40%' }}
            onSubmit={this.onFinish}
          >
            <div className={styles.heading}>
              Sign In
            </div>
            <Form.Item>
              {getFieldDecorator('userId', {
                rules: [{ required: true, message: 'Please input your Username!' }],
              })(
              <Input size="large" placeholder="Username" />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              </Form.Item>

            <Form.Item>
              <Button size="large" type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Login;

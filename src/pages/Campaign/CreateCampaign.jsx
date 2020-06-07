import { Form, Input } from 'antd';
import React, { Component } from 'react';
import TweenOneGroup from 'rc-tween-one';

const { TextArea } = Input;
const FormItem = Form.Item;
export default class CreateCampaign extends Component {
  state = { };

  validateName = (rule, value, callback) => {
    if (value && value.length < 3) {
      callback('At-least three characters required');
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const createCampaignForm = () => (
        <TweenOneGroup animation={{ opacity: 0, x: 30, type: 'from' }}>
          <Form style={{ overflow: 'auto' }}>
            <FormItem label="Campaign Name">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: 'Please enter any custom name',
                }, {
                  validator: this.validateName,
                }],
              })(
                <Input placeholder="Campaign name"/>,
              )}
            </FormItem>
            <FormItem label="Campaign Description">
              {getFieldDecorator('description', {
                rules: [{
                  required: true,
                  message: 'Please enter the description',
                }],
              })(
                <TextArea placeholder="Campaign Description"/>,
              )}
            </FormItem>
          </Form>
        </TweenOneGroup>
      );
    return (
      <div>
        {createCampaignForm()}
      </div>
    );
  }
}

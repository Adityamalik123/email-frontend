import { Form, Input } from 'antd';
import React, { Component } from 'react';
import TweenOneGroup from 'rc-tween-one';
import CronEditor from './CronEditor'

const { TextArea } = Input;
const FormItem = Form.Item;
export default class ConfigureEmail extends Component {
  state = {
    cron: 'cron',
  };

  validateName = (rule, value, callback) => {
    if (value && value.length < 2) {
      callback('At-least two characters required');
    } else {
      callback();
    }
  };

  setCronExpression = (cronChoice, nextExecutionTime, cronExpirationDate, cron) => {
    this.props.form.setFieldsValue({ schedule: {
      cronChoice,
      nextExecutionTime,
      cronExpirationDate,
      cron,
    } });
    this.setState({ cron, cronChoice, nextExecutionTime, cronExpirationDate });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, editId } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const createCampaignForm = () => (
      <TweenOneGroup animation={{ opacity: 0, x: 30, type: 'from' }}>
        <Form {...formItemLayout} style={{ overflow: 'auto' }}>
          <FormItem label="Subject">
            {getFieldDecorator('subject', {
              rules: [{
                required: true,
                message: 'Please enter subject',
              }, {
                validator: this.validateName,
              }],
              initialValue: (data && data.subject) || undefined,
            })(
              <Input placeholder="Use a brief and catchy subject"/>,
            )}
          </FormItem>
          <FormItem label="Content">
            {getFieldDecorator('content', {
              rules: [{
                required: true,
                message: 'Please specify the content',
              }],
              initialValue: (data && data.content) || undefined,
            })(
              <TextArea placeholder="Content For Email" autoSize={{ minRows: 5 }}/>,
            )}
          </FormItem>
          <Form.Item label="When to Execute">
            {getFieldDecorator('schedule', {
              rules: [
                {
                  required: true,
                  message: 'Please specify the Execution Info',
                },
              ],
            })(
              <CronEditor
                editId={editId}
                setCronExpression={this.setCronExpression}
                data={data && data.schedule}
                nextExecutionTime={this.state.nextExecutionTime}
                cronExpirationDate={this.state.cronExpirationDate}
                activeCronChoice={this.state.cronChoice}
                cron={this.state.cron}
              />,
            )}
          </Form.Item>
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

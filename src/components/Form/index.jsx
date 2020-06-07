import React from 'react';
import { Form, Input, Icon, Button, Tooltip, Select, Typography } from 'antd'; // loading components from code split
import _ from 'lodash';

const { Option } = Select;
const { Text } = Typography;

class GenericForm extends React.Component {
  handleSubmit = e => {
    const {
      onSubmit,
      form: { validateFields, resetFields },
    } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        onSubmit(values, resetFields);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      formFields,
      onCancel,
      submitButtonTitle = 'Submit',
      cancelButtonTitle = 'Cancel',
      submitButtonLoading = false,
    } = this.props;
    return (
      <div style={{ display: 'grid' }}>
        <Form onSubmit={this.handleSubmit} className="login-form">
          {_.map(formFields, element => (
            <div>
              {!element.selectInput && (
                <Form.Item key={element.name}>
                  {getFieldDecorator(
                    element.name,
                    element.rules
                      ? { rules: element.rules, initialValue: element.initialValue }
                      : {
                          rules: [
                            {
                              required: element.required,
                              message: element.errorMessage,
                            },
                          ],
                          initialValue: element.initialValue,
                        },
                  )(
                    <Input
                      disabled={element.disabled}
                      prefix={
                        element.fieldIcon && (
                          <Icon type={element.fieldIcon} style={{ color: 'rgba(0,0,0,.25)' }} />
                        )
                      }
                      suffix={
                        (element.suffix && (
                          <Tooltip title={element.toolTipTitle}>
                            <Icon type={element.toolTipIcon} style={{ color: 'rgba(0,0,0,.45)' }} />
                          </Tooltip>
                        )) ||
                        (element.copyable && <Text copyable={{ text: element.initialValue }} />)
                      }
                      placeholder={element.placeHolder}
                    />,
                  )}
                </Form.Item>
              )}
              {element.selectInput && (
                <Form.Item key={element.name}>
                  {getFieldDecorator(
                    element.name,
                    element.rules
                      ? { rules: element.rules, initialValue: element.initialValue }
                      : {
                          rules: [
                            {
                              required: element.required,
                              message: element.errorMessage,
                            },
                          ],
                          initialValue: element.initialValue,
                        },
                  )(
                    <Select
                      showSearch
                      disabled={element.disabled}
                      placeholder={element.placeHolder}
                      optionFilterProp="children"
                      onChange={value => this.props.form.setFieldsValue({ [element.name]: value })}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {element.data &&
                        _.map(element.data, item => (
                          <Option
                            value={item.dial_code && item.dial_code.replace(/ |\+/g, '')}
                          >{`( ${item.dial_code} ) ${item.name}`}</Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              )}
            </div>
          ))}
          <Form.Item style={{ float: 'right' }}>
            <Button type="secondary" onClick={onCancel} style={{ marginRight: 10 }}>
              {cancelButtonTitle}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 10 }}
              loading={submitButtonLoading}
            >
              {submitButtonTitle}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(GenericForm);

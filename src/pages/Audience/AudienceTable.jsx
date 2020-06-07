import { Form, Input, Row, Col, Select } from 'antd';
import React, { Component } from 'react';
import TweenOneGroup from 'rc-tween-one';

const FormItem = Form.Item;
const { Option } = Select;
export default class CreateTable extends Component {
  state = { };

  validateName = (rule, value, callback) => {
    const { allTables } = this.props;
    if (value && !value.match(/^[a-z0-9_]{3,40}$/)) {
      callback('Audience name should be alphanumeric');
    } else if (allTables && allTables.indexOf(value) !== -1) {
      callback('Two audiences can\'t have the same name');
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const getDefaultFields = (i, count) => {
      const { name } = i;
      const { type } = i;
      const childrens = [];
      childrens.push(
        <Col span={14} key={`Name${name}`} style={{ block: 'none' }}>
          <FormItem key={`Namedefault${count}`} label="Name">
              <Input placeholder={name} disabled/>
          </FormItem>
        </Col>);
      childrens.push(
        <Col span={8} key={`Type${type}`} style={{ block: 'none' }}>
          <FormItem key={`Typeform${type}`} label="Type">
            <Select defaultValue={type} style={{ width: 160 }} disabled />
          </FormItem>
        </Col>);
      return childrens;
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    const defaultColumns = columnsparam => {
      const reducedColumns = columnsparam.filter(i => i.name !== 'inserted');
      return reducedColumns.map((i, count) => (
          <TweenOneGroup animation={{ opacity: 0, x: 30, type: 'from' }}>
            <FormItem
              {...(formItemLayout)}
              required={false}
            >
              <Row gutter={24}>{getDefaultFields(i, count)}</Row>
            </FormItem>
          </TweenOneGroup>

        ));
    };

    const columns = [{
      name: 'Name',
      type: 'String',
    }, {
      name: 'Email',
      type: 'Email',
    }];

    const createTableForm = () => (
        <Form style={{ height: '450px', overflow: 'auto' }}>
            <FormItem label="Audience Name">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: 'Please enter the audience name',
                }, {
                  validator: this.validateName,
                }],
              })(
                <Input placeholder="Audience name" />,
              )}
            </FormItem>

          {defaultColumns(columns)}
        </Form>
      );
    return createTableForm();
  }
}

/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import _ from 'lodash';
import { Button, Select, Steps, Skeleton, Table, Spin, List, Form, Modal, Icon, Result } from 'antd';
import EmailFormWrapper from './EmailForm';
import ConfigureEmail from '@/pages/Campaign/ConfigureEmail';

const { Step } = Steps;
const { Option } = Select;
const ConfigureEmailForm = Form.create()(ConfigureEmail);
const { confirm } = Modal;


export default class Email extends Component {
  state = {
    current: 0,
    previewItems: [],
  };


  componentDidMount() {
  }

  selectAudience = async value => {
    if (value) {
      value = JSON.parse(value);
      const { tableColumns } = this.props;
      const data = await tableColumns(value._id, value.columns);
      this.setState({ audience: value._id, audienceName: value.name, tableInfo: data });
    } else {
      this.setState({ audience: undefined, audienceName: undefined });
    }
  };

  next = () => {
    const current = this.state.current + 1;
      this.setState({ current });
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  audienceList = () => {
    const { audience } = this.props;
    return audience && audience.map(i => (
        <Option key={i._id} value={JSON.stringify(i)}>{i.name}</Option>
      ));
  };

  addEmailContent = () => {
    this.setState({ visibleCreate: true });
  };

  updateEmailContent = key => {
    this.setState({ visibleModify: true, editId: key });
  };

  handleCancelCreate = () => {
    const { form } = this;
    form.resetFields();
    this.setState({ visibleCreate: false });
  };

  handleCancelUpdate = () => {
    const { form } = this;
    form.resetFields();
    this.setState({ visibleModify: false });
  };

  saveFormRef = form => {
    this.form = form;
  };

  saveFormRefModify = form => {
    this.formModify = form;
  };

  handleOkCreate = () => {
    const { form } = this;
    const { previewItems } = this.state;
    const data = _.cloneDeep(previewItems);
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.handleCancelCreate();
      data.push(values);
      this.setState({ previewItems: data })
    });
  };

  handleDelete = () => {
    const { previewItems, editId } = this.state;
    const data = _.cloneDeep(previewItems);
    this.handleCancelUpdate();
    data.splice(editId, 1);
    this.setState({ previewItems: data })
  };

  handleOkUpdate = () => {
    const { formModify } = this;
    const { previewItems, editId } = this.state;
    formModify.validateFields((err, values) => {
      if (err) {
        return;
      }
      previewItems[editId] = values;
      this.handleCancelUpdate();
      this.setState({ previewItems })
    });
  };

  render() {
    const { showReports, pageLoading, addAudienceLink, handleSubmit } = this.props;
    const { current, tableInfo, previewItems, visibleModify, visibleCreate, editId } = this.state;
    return (
      <div>
        <Spin spinning={pageLoading}>
          <Modal
            title="Configure Email"
            visible={visibleCreate}
            onOk={this.handleOkCreate}
            onCancel={this.handleCancelCreate}
            width={1050}
            maskStyle={{
              background: 'rgba(4, 1, 55, 0.3)',
            }}
            footer={
              <div>
                <Button onClick={this.handleCancelCreate}>Cancel</Button>
                <Button type="primary" onClick={this.handleOkCreate}>
                  Begin
                </Button>
              </div>
            }
          >
            <ConfigureEmailForm
              ref={this.saveFormRef}
              editId={Math.floor(Math.random() * (1000 - 100) + 100)}
            />
          </Modal>
          <Modal
            title="Configure Email"
            visible={visibleModify}
            onOk={this.handleOkUpdate}
            onCancel={this.handleCancelUpdate}
            width={1050}
            maskStyle={{
              background: 'rgba(4, 1, 55, 0.3)',
            }}
            footer={
              <div>
                <div style={{ float: 'left', fontSize: 'small', lineHeight: '33px' }}><a onClick={this.handleDelete} style={{ color: '#ff1818c9', fontWeight: 'bolder' }}>Delete</a></div>
                <Button onClick={this.handleCancelUpdate}>Cancel</Button>
                <Button type="primary" onClick={this.handleOkUpdate}>
                  Modify
                </Button>
              </div>
            }
          >
            <ConfigureEmailForm
              editId={editId}
              ref={this.saveFormRefModify}
              data={previewItems[editId] || {}}
            />
          </Modal>
          {
            !showReports &&
            <div style={{ display: 'flex', height: '100%', overflow: 'hidden', width: '100%' }}>
              <div style={{ marginRight: '10%', width: 'max-content' }}>
                <Steps progressDot direction="vertical" current={current} style={{ height: 'calc(100vh - 300px)', width: 'max-content' }}>
                  <Step title="To" description="Who are you sending this campaign to ?" style={{ height: '40%' }}/>
                  <Step title="Info" description="Define the email content."/>
                </Steps>
              </div>
              <div style={{ width: '100%' }}>
                {
                  current === 0 &&
                  <div
                    style={{ width: '100%' }}
                  >
                    <div
                      style={{ display: 'flex' }}
                    >
                      <div style={{ width: '50%', marginBottom: '40px' }}>
                        <h3>Audience</h3>
                        <Select
                          placeholder="Choose an audience"
                          style={{ width: '60%', marginTop: '7px' }}
                          allowClear
                          value={this.state && this.state.audienceName}
                          onChange={this.selectAudience}
                        >
                          {this.audienceList()}
                        </Select>
                        <div style={{ lineHeight: '15px', fontSize: '12px', marginTop: '2px', marginBottom: '10px' }}>
                          Not in the list? <a onClick={addAudienceLink} style={{ fontSize: 'inherit' }}>Add Audience</a>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3>Preview</h3>
                      <Skeleton
                        loading={!this.state.audience}
                      >
                        <Table
                          style={{
                            marginTop: '20px',
                          }}
                          columns={ tableInfo && tableInfo.tableColumns }
                          dataSource={tableInfo && tableInfo.dataSource}
                          size="small"
                          pagination={{
                            position: 'bottom',
                            defaultPageSize: 5,
                            hideOnSinglePage: true,
                          }}
                        />
                        <div style={{ padding: '20px 10px 10px 0' }}>
                          {tableInfo && tableInfo.total > 0 &&
                          <p>Total Records Matched - {tableInfo.total}</p>}
                          {tableInfo && tableInfo.total === 0 && <p>No Record Matched</p>}
                        </div>
                      </Skeleton>
                    </div>
                    <div>
                      <Button onClick={this.next} disabled={!this.state.audience} type="primary" style={{ margin: '10px 10px 10px 0' }}> Next</Button>
                    </div>
                  </div>
                }
                {current === 1 &&
                <div
                  style={{ width: '50%', minHeight: '200px' }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ overflow: 'auto' }}>
                      <h3>Configure Email</h3>
                      {
                        previewItems.length > 0 ? <div>
                          <div style={{ lineHeight: '15px', fontSize: '12px', marginBottom: '30px' }}>
                            <a onClick={this.addEmailContent} style={{ fontSize: 'inherit' }}>Add Email</a>
                          </div>
                          <List
                            size="large"
                            bordered
                            dataSource={previewItems}
                            renderItem={(item, idx) => (
                              <EmailFormWrapper
                                showUpdate={this.updateEmailContent}
                                keys={idx}
                                item={item}
                              />
                            )}
                          />
                        </div> :
                          <a onClick={this.addEmailContent}>
                          <Result
                            icon={<Icon type="mail"/>}
                            subTitle={
                              <div>You haven&apos;t added any content yet
                                <div style={{ padding: 10 }}>
                                  <h4 style={{ color: '#1890FF' }}>Configure Email</h4>
                                </div>
                              </div>}
                          />
                          </a>
                      }
                      <Button
                        onClick={() => {
                          confirm({
                            title: 'Are you sure you want to submit this campaign?',
                            onOk: () => handleSubmit(this.state),
                            onCancel() {
                            },
                          });
                        }}
                        disabled={previewItems && previewItems.length === 0}
                        type="primary"
                        style={{ margin: '10px 10px 10px 0' }}
                      > Next
                      </Button>
                      <Button onClick={this.prev} style={{ margin: '10px 10px 10px 0' }}> Previous</Button>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          }
        </Spin>
      </div>
    )
  }
}

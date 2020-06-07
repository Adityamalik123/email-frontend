import TweenOneGroup from 'rc-tween-one';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import React, { Component } from 'react';
import moment from 'moment';
import { Card, Menu, Col, Layout, Skeleton, Result, Divider, Upload, Table, Button, Icon, Row, Modal, Form } from 'antd';
import { connect } from 'dva';

import styles from './Audience.less';
import CreateTable from './AudienceTable'

const { Content } = Layout;
const limit = 10;
const CreateTableForm = Form.create()(CreateTable);

@connect(state => ({
  audience: state.audience,
  user: state.user,
}))
class Audience extends Component {
  state = {
    selectedTab: 'audience',
    currentPage: 1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'audience/getAllAudiences',
      limit,
      page: 1,
    });
  }

  saveFormRefAudience = form => {
    this.formAudience = form;
  };

  showAddAudienceModal = () => {
    this.setState({
      visibleCreateTable: true,
    });
  };

  handleCancelCreateTable = () => {
    const form = this.formAudience;
    form.resetFields();
    this.setState({
      visibleCreateTable: false,
    });
  };

  handleOk = () => {
    const form = this.formAudience;
    const { dispatch, audience: { data } } = this.props;
    // console.log(this.props, 'prop')
    form.validateFields((err, values) => {
      console.log(values, 'value')
      form.resetFields();
      if (err) {
        return;
      }
      this.setState({ visibleCreateTable: false });
      const columns = [{
        name: 'Name',
        type: 'String',
      }, {
        name: 'Email',
        type: 'Email',
      }, {
        name: 'Inserted',
        type: 'Date',
      }];

      dispatch({
        type: 'audience/createAudience',
        payload: { columns, ...values, data },
      });
    });
  };

  // eslint-disable-next-line consistent-return
  getHumanReadableDate = isoDate => {
    if (isoDate) {
      return moment(isoDate).format('LLLL');
    }
  };

  tableColumns = () => {
    // console.log(this.props, 'prop')
    const { audience: { records, current } } = this.props;
    let dataSource = [];
    let columns = [];
    if (records) {
      dataSource = records.map((i, key) => {
        const obj = {};
        // eslint-disable-next-line array-callback-return
        Object.keys(i).map(j => {
          if (j === 'inserted') {
            obj[j] = this.getHumanReadableDate(i[j]);
          } else {
            obj[j] = i[j];
          }
        });
        obj.key = key;
        return obj;
      });
    }

    if (current && current.columns) {
      columns = _.chain(current.columns).map(i => ({
            title: i.name,
            dataIndex: i.name.toLowerCase(),
            key: i.name,
          })).value();
    }

    return { dataSource, columns };
  };

  handleChangeUpload = info => {
    if (info.file.status === 'uploading') {
      this.setState({ uploading: true });
      return;
    }

    if (info.file.status === 'done') {
      const { dispatch, audience: { tableName, current } } = this.props;
      const payload = {};
      payload.url = info.file.response.url;
      payload.table = tableName;
      // eslint-disable-next-line no-underscore-dangle
      payload.audienceId = current._id;
      dispatch({
        type: 'audience/uploadData',
        payload: { payload, current },
      });
      setTimeout(() => {
        this.setState({ uploading: false });
      }, 200);
    }
  };

  selectTable = e => {
    const { dispatch, audience: { current } } = this.props;
    this.setState({
      currentPage: 1,
    });
    dispatch({
      type: 'audience/handleChangeAudience',
      payload: { audienceId: e.key, limit, current },
    });
  };

  // eslint-disable-next-line class-methods-use-this,react/sort-comp
  downloadSampleFile() {
    const fileName = 'Sample Upload CSV';

    const rows = [['Name', 'Email'], ['Aditya Malik', 'adityamalik360@gmail.com']];

    let csvContent = '';
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i].join(',');
      csvContent += `${row}\r\n`;
    }

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    element.setAttribute('download', `${fileName}.csv`);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onChangePagination = (pageNumber) => {
    const { dispatch, audience: { current, tableName } } = this.props;
      dispatch({
        type: 'audience/handleChangeAudience',
        // eslint-disable-next-line no-underscore-dangle
        payload: { audienceId: current._id, tableName, page: pageNumber, limit: String(limit) },
      });
    this.setState({
      currentPage: pageNumber,
    });
  };


  render() {
    const { selectedTab, currentPage, visibleCreateTable, uploading } = this.state;
    // eslint-disable-next-line max-len
    const { dispatch, audience: { page, count, tableName, data, records, dataLoading, loading, current } } = this.props;
    const tableDetails = this.tableColumns();
    const footer = () => {
      if (Number(limit) < Number(count)) {
        const num = ((page - 1) * Number(limit));
        return (
          <span>
            {/* eslint-disable-next-line max-len */}
            Showing from {num + 1} to {(num + limit) > count ? count : (num + limit)} out of {count} records
          </span>);
      }
        return (
          <span>
            Showing from {1} to {count} out of {count} records
          </span>);
    };
    const showfooter = count > 0 ? footer : undefined;
    const paginationProps = {
      position: 'bottom',
      current: currentPage,
      total: count,
      defaultPageSize: limit,
      hideOnSinglePage: true,
      onChange: this.onChangePagination,
    };

    return (
      <Card
        style={{
          marginTop: '-10px',
        }}
        loading={loading}
        bodyStyle={{
          height: 'calc(100vh - 65px)',
          padding: 0,
        }}
        bordered={false}
      >
        <Col>
          <Menu selectedKeys={[selectedTab]} mode="horizontal" onClick={e => {
            dispatch(routerRedux.push(`/notification/${e.key}`));
          }}>
            <Menu.Item key="campaigns">Campaigns
            </Menu.Item>
            <Menu.Item key="audience">Audience
            </Menu.Item>
            <Menu.Item key="scheduler">Scheduler
            </Menu.Item>
          </Menu>
        </Col>
        <TweenOneGroup animation={{ opacity: 0, x: -20, type: 'from' }}>
          <Skeleton style={{ padding: '2px 10px 10px 10px' }} active loading={loading}>
            <Modal
              title="Create an Audience"
              visible={visibleCreateTable}
              onOk={this.handleOk}
              onCancel={this.handleCancelCreateTable}
              width={700}
              footer={
                <div>
                  <Button onClick={this.handleCancelCreateTable}>Cancel</Button>
                  <Button type="primary" onClick={this.handleOk}>
                    Create
                  </Button>
                </div>
              }
            >
              <CreateTableForm
                ref={this.saveFormRefAudience}
              />
            </Modal>
            <Content
              style={{
                overflow: 'hidden',
                background: 'white',
              }}
            >
              {
                !tableName &&
                <div>
                  <Result
                    icon={<Icon type="usergroup-add"/>}
                    title="Create an Audience"
                    subTitle={
                      <div>You haven&apos;t added any subscribers yet
                        <div style={{ padding: 20 }}><Button type="primary" onClick={this.showAddAudienceModal}>Add
                          Audience</Button>
                        </div>
                      </div>}
                    style={{ marginTop: 150 }}
                  />
                </div>
              }
              {
                tableName &&
                <div>
                  <Row>
                    <Col
                      style={{
                        width: '19%',
                        height: 'calc(100vh - 110px)',
                        float: 'left',
                        overflow: 'auto',
                        borderRight: '1px solid #eee',
                      }}
                    >
                      <div style={{ textAlign: 'center', padding: 17, borderBottom: '1px solid rgb(238, 238, 238)' }}>
                        <Button type="primary" block icon="usergroup-add" onClick={this.showAddAudienceModal}>
                          Add Audience
                        </Button>
                      </div>
                      {/* eslint-disable-next-line no-underscore-dangle */}
                      <Menu style={{ float: 'left', overflowX: 'hidden', overflowY: 'auto', borderRight: '0px', display: 'inline-table' }} onSelect={this.selectTable} selectedKeys={[current && current._id]} mode="inline">
                         {data && data.map(i => {
                          const { name } = i;
                          return (
                            // eslint-disable-next-line no-underscore-dangle
                            <Menu.Item key={i._id}>
                              {(name.charAt(0).toUpperCase()) + (name.slice(1))}
                            </Menu.Item>
                          );
                         })}
                      </Menu>
                    </Col>
                    <Col
                      style={{
                        height: 'calc(100vh - 110px)',
                        overflow: 'auto',
                        background: 'rgba(0, 191, 255, 0.01)',
                      }}
                    >
                      <Card
                        title={
                          <span style={{ fontWeight: 700, display: 'flex' }}>
                            <div>{tableName.charAt(0).toUpperCase() + tableName.slice(1)}</div>
                             <div
                               style={{
                                 fontWeight: 400,
                                 fontSize: 'smaller',
                                 alignSelf: 'center',
                                 lineHeight: 'initial',
                               }}
                             >&nbsp;&nbsp;(&nbsp;{tableName}&nbsp;)
                             </div>
                          </span>
                        }
                        className={styles.topCard}
                        bordered={false}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ padding: '2px 10px 10px 10px' }} className={styles.dataTable}>
                          <Skeleton active loading={dataLoading}>
                            <TweenOneGroup animation={{ opacity: 0, x: 30, type: 'from' }}>
                              {records &&
                              <Table
                                title={() => (
                                  <div>
                                    <Upload
                                      name="file"
                                      accept=".csv"
                                      action={() => '/api/backend/audience/upload-link'}
                                      showUploadList={false}
                                      onChange={this.handleChangeUpload}
                                      className={styles.dataMenu}
                                    >
                                      <Button>
                                        <Icon type={uploading ? 'loading' : 'upload'}/>{uploading ? 'Uploading' : 'Upload data'}
                                      </Button>
                                    </Upload>
                                    <div style={{ fontSize: '12px', float: 'right', lineHeight: '30px' }}>
                                      Download <a onClick={this.downloadSampleFile} style={{ fontSize: 'inherit' }}>Sample File</a>
                                    </div>
                                    <Divider style={{ margin: '12px 0 6px 0' }}/>
                                  </div>)}
                                dataSource={tableDetails.dataSource}
                                columns={tableDetails.columns}
                                pagination={paginationProps}
                                size="middle"
                                bordered
                                style={{ overflowY: 'auto' }}
                                scroll={{ x: 'auto' }}
                                footer={showfooter}
                              />
                              }
                            </TweenOneGroup>
                          </Skeleton>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              }
            </Content>
          </Skeleton>
        </TweenOneGroup>
      </Card>
    );
  }
}

export default Audience;

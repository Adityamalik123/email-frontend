/* eslint-disable no-underscore-dangle */
import TweenOneGroup from 'rc-tween-one';
import { routerRedux } from 'dva/router';
import React, { Component } from 'react';
import moment from 'moment';
import { Card, Menu, Col, Layout, Form, Icon, Input, Select, List, Modal, Button, Spin, Avatar } from 'antd';
import { connect } from 'dva';
import { LoadingOutlined } from '@ant-design/icons';
import CreateCampaign from './CreateCampaign';
import styles from './Campaign.less'

const CreateCampaignForm = Form.create()(CreateCampaign);
const { Content } = Layout;
const { Search } = Input;

@connect(state => ({
  campaign: state.campaign,
}))
class Campaign extends Component {
  state = {
    selectSubMenu: 'list',
    selectedTab: 'campaigns',
    pageLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({ pageLoading: true });
    dispatch({
      type: 'campaign/fetchAll',
    }).then(() => {
      this.setState({ pageLoading: false });
    });
  }

  handleClickSubMenu = e => {
    this.setState({ selectSubMenu: e.key })
  };

  saveFormRef = form => {
    this.form = form;
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showCampaign = campaignId => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/notification/campaigns/${campaignId}`));
  };

  handleOk = () => {
    const { form } = this;
    const { dispatch, campaign: { data } } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.handleCancel();
      dispatch({
        type: 'campaign/createOrUpdate',
        payload: {
          name: values.name,
          description: values.description,
        },
        data,
      })
      //   .then(() => {
      //   // eslint-disable-next-line no-underscore-dangle
      //   this.showCampaign(data[0]._id);
      // });
    });
  };

  handleCancel = () => {
    const { form } = this;
    form.resetFields();
    this.setState({
      visible: false,
    });
  };

  render() {
    const { selectedTab, selectSubMenu, visible, pageLoading } = this.state;
    const { dispatch, campaign: { data } } = this.props;
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const {
      campaign: { loading },
    } = this.props;
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
          <Menu selectedKeys={[selectedTab]} mode="horizontal" style={{ marginBottom: '30px' }} onClick={e => {
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
          <Content
            style={{
              overflow: 'hidden',
              background: 'white',
            }}
          >
            <Col span={24}>
              <Menu onClick={this.handleClickSubMenu} selectedKeys={[selectSubMenu]} mode="horizontal"
                    style={{ marginLeft: '3%', marginBottom: '20px', marginRight: '4%' }}>
                <Menu.Item key="list">List View
                </Menu.Item>
                <Menu.Item disabled key="calendar">Calendar View
                </Menu.Item>
                <a onClick={this.showModal} style={{ float: 'right' }}><Icon type="usergroup-delete"/> Create Campaign</a>
              </Menu>
            </Col>
            {
              selectSubMenu && selectSubMenu === 'list' &&
              <div>
                <Menu
                  style={{ border: '0px', width: '20%', float: 'left', paddingLeft: '3%', overflow: 'hidden' }}
                  defaultSelectedKeys={['all']}
                  openKeys={['sub1']}
                >
                  <Menu.ItemGroup title="View by Status">
                    <Menu.Item key="all">All</Menu.Item>
                    <Menu.Item key="ongoing">Ongoing</Menu.Item>
                    <Menu.Item key="completed">Completed</Menu.Item>
                    <Menu.Item key="archived">Archived</Menu.Item>
                  </Menu.ItemGroup>
                </Menu>
                <Content
                  style={{
                    padding: '0 0 0 20px',
                    overflow: 'hidden',
                    background: 'white',
                  }}
                >
                  <div>
                    <Search size="default" placeholder="Find a campaign by name or type"
                            style={{ border: 'none', outline: 'none', maxWidth: 400 }}/>
                    <Select
                      style={{ minWidth: 150, float: 'right', marginRight: '4.5%' }}
                      placeholder="Sort By"
                      allowClear
                      defaultValue={['date']}
                    >
                      <Select.Option key="date" value="date">Creation Date</Select.Option>
                    </Select>
                  </div>
                   <Spin spinning={pageLoading} indicator={antIcon}>
                  <List
                    locale={{ emptyText: 'No campaigns yet' }}
                    style={{ margin: '25px 50px 20px 0' }}
                    itemLayout="horizontal"
                    pagination={{
                      pageSize: 5,
                    }}
                    dataSource={data}
                    renderItem={item => (
                      <List.Item
                        className={styles.contents}
                      >
                        <List.Item.Meta
                          avatar={
                            <div>
                              <Avatar style={{ background: 'white', color: '#243857', fontSize: '20px' }}><Icon type="mail"/></Avatar>
                            </div>
                          }
                          title={<a
                            onClick={() => this.showCampaign(item._id)}
                            style={{ color: '#243857' }}>{item.name}
                          </a>}
                          description={
                            <div style={{ color: '#00000099' }}>
                              <div style={{ fontSize: 'small', width: '25%' }}>{item.description}</div>
                              <div style={{ fontSize: 'smaller', margin: '0px 0px 2px 0px' }}>Created
                                - {moment(item.created).fromNow()}</div>
                            </div>
                          }
                        />
                        <div style={{ marginLeft: '30%', width: '50%', position: 'absolute' }}>
                          {item.status ? '' : 'Draft'}
                        </div>
                        <div className={styles.show}>
                          <Button onClick={() => this.showCampaign(item._id)} type="dashed">{item.status ? 'View Report' : 'Edit'}</Button>
                        </div>
                      </List.Item>
                    )}
                  />
                   </Spin>
                  <Modal
                    title="Create Campaign"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={700}
                    maskStyle={{
                      background: 'rgba(4, 1, 55, 0.3)',
                    }}
                    footer={
                      <div>
                        <Button onClick={this.handleCancel}>Cancel</Button>
                        <Button type="primary" onClick={this.handleOk}>
                          Begin
                        </Button>
                      </div>
                    }
                  >
                    <CreateCampaignForm ref={this.saveFormRef}/>
                  </Modal>
                </Content>
              </div>
            }
          </Content>
        </TweenOneGroup>
      </Card>
    );
  }
}

export default Campaign;

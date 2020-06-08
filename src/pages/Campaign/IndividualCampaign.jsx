/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import TweenOneGroup from 'rc-tween-one';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import React, { Component } from 'react';
import { Card, Menu, Col, Icon, message, Table, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'dva';

import Email from './Email';
import styles from '@/pages/Scheduler/Scheduler.less';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

@connect(state => ({
  campaign: state.campaign,
}))
class Campaign extends Component {
  state = {
    selectedTab: 'campaigns',
  };

  componentDidMount() {
    this.setState({ pageLoading: true });
    this.showCampaign(this.getParams().params.campaignId);
  }

  addAudienceLink = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/notification/audience'));
  };

  getParams = () => ({
      params: this.props.match.params || this.context.params,
  });

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/notification/campaigns'));
  };

  getAudience = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'campaign/fetchAudience',
    })
  };

  tableColumns = (audienceId, columns) => {
    let dataSource = [];
    let tableColumns = [];
    let total;
    const { dispatch } = this.props;
    return dispatch({
      type: 'campaign/getAudienceData',
      payload: {
        audienceId,
        page: 1,
        limit: 3,
      },
    }).then(() => {
      const { campaign: { audienceData } } = this.props;
      if (audienceData && audienceData.docs) {
        total = audienceData.totalDocs;
        dataSource = audienceData.docs.map((i, key) => {
          const obj = {};
          Object.keys(i).map(j => {
            if (j !== 'inserted') {
              obj[j] = i[j];
            }
          });
          obj.key = key;
          return obj;
        });
        if (total > 3) {
          const obj = {};
          Object.keys(dataSource[0]).map(i => {
            obj[i] = '...'
          });
          obj.key = 4;
          dataSource.push(obj);
        }
      }

      if (columns) {
        tableColumns = _.chain(columns).map(i => ({
              title: i.name,
              dataIndex: i.name.toLowerCase(),
              key: i.name,
              type: i.type,
            })).filter(i => {
          if (i.dataIndex !== 'inserted') {
            return i;
          }
        }).value();
      }
      return { dataSource, tableColumns, total };
    });
  };

  handleSubmit = data => {
    const { dispatch, campaign: { campaignInfo } } = this.props;
    const { previewItems, audience } = data;
    _.map(previewItems, i => {
      if (_.get(i, 'schedule.cronChoice') === '1') {
        dispatch({
          type: 'campaign/createJob',
          payload: {
            audienceId: audience,
            schedule: '@once',
            executionTime: i.schedule.nextExecutionTime,
            campaignId: campaignInfo._id,
            listId: campaignInfo.listIdSg,
            name: campaignInfo.name,
            content: i.content,
            subject: i.subject,
          },
        })
      } else {
        dispatch({
          type: 'campaign/createJob',
          payload: {
            audienceId: audience,
            schedule: i.schedule.cron.join(' '),
            campaignId: campaignInfo._id,
            name: campaignInfo.name,
            listId: campaignInfo.listIdSg,
            content: i.content,
            subject: i.subject,
            options: { cronExpirationDate: i.schedule.cronExpirationDate },
          },
        })
      }
    });
    const clonedCampaign = _.cloneDeep(campaignInfo);
    clonedCampaign.status = 'ongoing';
    dispatch({
      type: 'campaign/updateCampaigns',
      payload: clonedCampaign,
    }).then(() => {
      dispatch(routerRedux.push('/notification/scheduler'));
      message.success('Request in progress. You can track it in scheduler tab.');
    });
  };

  showCampaign = campaignId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'campaign/fetchInfo',
      payload: {
        campaignId,
      },
    }).then(() => {
      const { campaign: { campaignInfo } } = this.props;
      if (campaignInfo.status) {
        dispatch({
          type: 'campaign/fetchStats',
          payload: {
            campaignId: campaignInfo._id,
          },
        }).then(() => {
          this.setState({ pageLoading: false });
        });
      } else {
          this.setState({ pageLoading: false });
          this.getAudience();
      }
    });
  };

  getData = () => {
    const { campaign: { stats } } = this.props;
    return _.map(stats, i => ({
      id: i.id,
      subject: i.subject,
      delivered: i.data.delivered || '-',
      opens: i.data.opens || '-',
      requests: i.data.requests || '-',
      unique_opens: i.data.unique_opens || '-',
      spam_reports: i.data.spam_reports || '-',
      invalid_emails: i.data.invalid_emails || '-',
    })).reverse();
  };

  render() {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
      },
      {
        title: 'Requests',
        dataIndex: 'requests',
      },
      {
        title: 'Delivered',
        dataIndex: 'delivered',
      },
      {
        title: 'Opens',
        dataIndex: 'opens',
      },
      {
        title: 'Unique Opens',
        dataIndex: 'unique_opens',
      },
      {
        title: 'Spam Reports',
        dataIndex: 'spam_reports',
      },
      {
        title: 'Invalid Emails',
        dataIndex: 'invalid_emails',
      },
    ];
    const { selectedTab, pageLoading } = this.state;
    const { dispatch, campaign: { campaignInfo, audience } } = this.props;
    const showReports = campaignInfo && campaignInfo.status;
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
          <Card
            bordered={false}
            style={{ height: 'calc(100vh - 150px)' }}
            cover={
              <div style={{ height: '0px' }}>
                <div style={{ position: 'absolute', top: 0, width: '100%', left: 0 }}/>
              </div>
            }
            title={
              <a onClick={this.goBack}><Icon type="arrow-left" /> </a>
            }
            >
            <div style={{ paddingLeft: '4%' }}>
            <div style={{ lineHeight: '15px', marginBottom: '3%', marginTop: 15 }}>
              <h2 style={{ color: '#243857', fontSize: '1.4rem' }}>{campaignInfo && campaignInfo.name}</h2>
            </div>
              {
                showReports &&
                  <div>
                    <Spin spinning={pageLoading} indicator={antIcon}>
                      <Table
                        className={styles.table}
                        columns={columns}
                        dataSource={this.getData()}
                        size="default"
                      />
                    </Spin>
                  </div>
              }
              {
                !showReports &&
                <Email
                  handleSubmit={this.handleSubmit}
                  pageLoading={pageLoading}
                  audience={audience}
                  tableColumns={this.tableColumns}
                  addAudienceLink={this.addAudienceLink}
                />
              }
            </div>
          </Card>
        </TweenOneGroup>
      </Card>
    );
  }
}

export default Campaign;

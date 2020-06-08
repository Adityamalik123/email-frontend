import _ from 'lodash';
import TweenOneGroup from 'rc-tween-one';
import { routerRedux } from 'dva/router';
import React, { Component } from 'react';
import { Card, Menu, Col, Layout, Divider, Table, Tag, Icon } from 'antd';
import { connect } from 'dva';
import momentTimezone from 'moment-timezone';
import moment from 'moment';
import styles from './Scheduler.less'

const { Content } = Layout;

@connect(state => ({
  scheduler: state.scheduler,
}))
class Scheduler extends Component {
  state = {
    selectedTab: 'scheduler',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const timeZone = 'Asia/Kolkata' || momentTimezone.tz.guess(); // Need to verify how it works for other timezone, then i can remove Asia
    dispatch({
      type: 'scheduler/fetchList',
    });
    setInterval(() => {
      this.setState({
        currTime: moment().tz(timeZone).format('MM/DD/YYYY hh:mm:ss A z'),
      });
    }, 1000);
    this.timer = setInterval(() => {
      this.setState({ refreshLoading: true });
      dispatch({
        type: 'scheduler/fetchList',
      }).then(() => {
        this.setState({ refreshLoading: false });
      });
    }, 6000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getData = () => {
    const { scheduler: { schedulerList } } = this.props;
    return _.map(schedulerList, i => ({
        icon: i.status,
        key: i.id,
        name: i.displayName,
        category: i.type,
        schedule: i.schedule,
        lastExecutionTime: i.lastExecutionTime ? moment(i.lastExecutionTime).format('LLLL') : 'Never',
        nextExecutionTime: i.nextExecutionTime ? moment(i.nextExecutionTime).format('LLLL') : 'Never',
      })).reverse();
  };

  handleStop = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduler/stopJob',
      id,
    }).then(() => {
      dispatch({
        type: 'scheduler/fetchList',
      });
    });
  };


  render() {
    const { selectedTab } = this.state;
    const { dispatch } = this.props;
    const jobStatusFromCode = code => {
      switch (code) {
        case 0:
          return {
            status: 'PENDING-UPLOAD',
            color: 'blue',
          };
        case 1:
          return {
            status: 'ASSIGNED-UPLOAD',
            color: 'purple',
          };
        case 2:
          return {
            status: 'SCHEDULED-UPLOAD',
            color: 'purple',
          };
        case 3:
          return {
            status: 'PENDING-SG',
            color: 'orange',
          };
        case 4:
          return {
            status: 'ASSIGNED-SG',
            color: 'purple',
          };
        case 5:
          return {
            status: 'SCHEDULED-SG',
            color: 'purple',
          };
        case 6:
          return {
            status: 'COMPLETED',
            color: 'green',
          };
        case 7:
          return {
            status: 'FAILED',
            color: 'red',
          };
        case 8:
          return {
            status: 'STOPPED',
            color: 'grey',
          };
        default:
          return {
            status: 'UNKNOWN',
            color: 'grey',
          };
      }
    };
    const columns = [
      {
        title: 'Status',
        dataIndex: 'icon',
        render: icon => {
          const { color } = jobStatusFromCode(icon);
          const { status } = jobStatusFromCode(icon);
          return (
            <Tag color={color} key={icon}>
              {status}
            </Tag>)
        },
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Schedule',
        dataIndex: 'schedule',
        render: schedule => <div style={{ fontWeight: '600' }}>{schedule}</div>,
      },
      {
        title: 'Last Execution Time',
        dataIndex: 'lastExecutionTime',
      },
      {
        title: 'Next Execution Time',
        dataIndex: 'nextExecutionTime',
      },
      {
        title: 'Actions',
        dataIndex: 'key',
        render: (key, record) => (
          <span>
            {record.category !== 'segment-creation' ?
              (
                <div>
                  {record.icon !== 6 && record.icon !== 7 && record.icon !== 8 && (
                    <span>
                      <a onClick={() => this.handleStop(key)}>Stop</a>
                    </span>
                  )}
                </div>) : '-'
            }
          </span>
        ),
      },
    ];
    const {
      scheduler: { loading },
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
          <Content
            style={{
              overflow: 'hidden',
              background: 'white',
              padding: '24px',
            }}
          >
            <Col span={16}>
              <div
                style={{
                  padding: '20px',
                  marginBottom: '5px',
                }}
              >
                <a
                  style={{
                    fontSize: 'small',
                    fontWeight: 500,
                    color: 'black',
                  }}
                >
                  {this.state.currTime}
                </a>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  float: 'right',
                  padding: '20px',
                  marginBottom: '5px',
                }}
              >
              {this.state.refreshLoading && <a style={{ fontSize: 'small', fontWeight: 500, color: 'black' }}><Icon type="loading" /> &nbsp; Refreshing</a>}
              </div>
            </Col>
            <Divider />
            <div>
              <Content
                style={{
                  padding: '20px',
                  overflow: 'hidden',
                }}
              >
                <Table
                  className={styles.table}
                  columns={columns}
                  dataSource={this.getData()}
                  size="default"
                />
              </Content>
            </div>
          </Content>
        </TweenOneGroup>
      </Card>
    );
  }
}

export default Scheduler;

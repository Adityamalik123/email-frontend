import TweenOneGroup from 'rc-tween-one';
import { routerRedux } from 'dva/router';
import React, { Component } from 'react';
import { Card, Menu, Col, Layout, Divider, Table, Tag } from 'antd';
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


  render() {
    const { selectedTab } = this.state;
    const { dispatch } = this.props;
    const columns = [
      {
        title: 'Status',
        dataIndex: 'icon',
        render: icon => {
          let color = 'blue';
          let status = 'PENDING';
          if (icon) {
            if (icon === 2) {
              color = 'blue';
              status = 'SCHEDULED'
            } else if (icon === 3) {
              color = 'red';
              status = 'FAILED';
            } else if (icon === 1) {
              color = 'blue';
              status = 'ASSIGNED';
            } else if (icon === 4) {
              color = 'green';
              status = 'COMPLETED';
            } else if (icon === 5) {
              color = 'orange';
              status = 'PAUSED';
            }
          }
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
              <div>
                {record.icon !== 4 ? (
                  <a onClick={() => this.handleEdit(key)}>Edit</a>) : '-'
                }
                {record.icon !== 5 && record.icon !== 4 && (
                  <span>
                    <Divider type="vertical"/>
                    <a onClick={() => this.handlePause(key, 5)}>Pause</a>
                  </span>
                )}
                {record.icon === 5 && (
                  <span>
                    <Divider type="vertical"/>
                    <a onClick={() => this.handlePause(key, 0)}>Resume</a>
                  </span>
                )}
              </div>
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
            <Col span={24}>
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

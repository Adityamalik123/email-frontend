/* eslint-disable max-len */
import React from 'react';
import { Row, Input, Col, Radio, Card, DatePicker, Icon, Tooltip } from 'antd';
import moment from 'moment';

class CronEditor extends React.Component {
  state = {
    cron: [
      '*/10',
      '*',
      '*',
      '*',
      '*',
    ],
    activeCronChoice: '1',
    nextExecutionTime: moment(),
    cronExpirationDate: moment().add(5, 'days'),
  };

  componentDidMount() {
    const { data, setCronExpression } = this.props;
    const { cron, nextExecutionTime, activeCronChoice } = this.state;
    if (data) {
      setCronExpression(data.cronChoice, data.nextExecutionTime, data.cronExpirationDate, data.cron);
    } else {
      setCronExpression(activeCronChoice, nextExecutionTime, undefined, cron);
    }
  }

  componentDidUpdate(prevProps) {
    this.setStateFromProps(prevProps);
  }


  setStateFromProps(prevProps) {
    const { editId, cron, activeCronChoice, cronExpirationDate, nextExecutionTime, data } = this.props;
    if (prevProps.editId !== editId) {
      console.log(data)
      if (data) {
        this.setState({ cron: data.cron, activeCronChoice: data.cronChoice, nextExecutionTime: data.nextExecutionTime, cronExpirationDate: data.cronExpirationDate }, () => {
          this.props.setCronExpression(this.state.activeCronChoice, this.state.nextExecutionTime, this.state.cronExpirationDate, this.state.cron);
        });
      } else {
        this.setState({ cron, activeCronChoice, nextExecutionTime, cronExpirationDate }, () => {
          this.props.setCronExpression(this.state.activeCronChoice, this.state.nextExecutionTime, this.state.cronExpirationDate, this.state.cron);
        });
      }
    }
  }

  setCronExpressionFromDate = date => {
    this.setState({ nextExecutionTime: date });
    this.props.setCronExpression(this.state.activeCronChoice, date, this.state.cronExpirationDate, this.state.cron);
  };

  setCronExpressionExpiry = date => {
    this.setState({ cronExpirationDate: date });
    this.props.setCronExpression(this.state.activeCronChoice, this.state.nextExecutionTime, date, this.state.cron);
  };

  cronChange = (value, index, reset = false) => {
    let { cron, cronExpirationDate } = this.state;
    if (reset) {
      cron = ['*/10', '*', '*', '*', '*'];
      cronExpirationDate = moment().add(5, 'days')
    }
    cron[index] = value;
    this.setState({ cron });
    console.log(this.state, 'state')
    this.props.setCronExpression('2', this.props.nextExecutionTime, cronExpirationDate, cron);
  };

  handleCronChange = event => {
    this.setState({ activeCronChoice: event.target.value });
    this.props.setCronExpression(event.target.value, this.props.nextExecutionTime, this.props.cronExpirationDate, this.state.cron);
    if (event.target.value === '2') {
      this.cronChange('*/10', 0, true);
    }
  };

  minuteChange = event => {
    this.cronChange(event.target.value, 0, false);
  };

  hourChange = event => {
    this.cronChange(event.target.value, 1, false);
  };

  dayChange = event => {
    this.cronChange(event.target.value, 2, false);
  };

  monthChange = event => {
    this.cronChange(event.target.value, 3, false);
  };

  weekChange = event => {
    this.cronChange(event.target.value, 4, false);
  };

  render() {
    const options = [
      { label: 'Once:', value: '1' },
      { label: 'Cron Expression:', value: '2' },
    ];

    return (
      <div>
        <Radio.Group
          options={options}
          onChange={this.handleCronChange}
          value={this.state.activeCronChoice}
        />
        {this.state.activeCronChoice === '1' && (
          <Card
            style={{ marginTop: '15px' }}
          >
            <DatePicker
              disabledDate={d => d && d < moment().startOf('day')}
              showToday={false}
              onChange={this.setCronExpressionFromDate}
              showTime
              defaultValue={null}
              value={this.props.nextExecutionTime}
            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Tooltip title="Will run once on the scheduled time">
              <Icon type="info-circle"/>
            </Tooltip>
          </Card>
        )}
        {this.state.activeCronChoice === '2' && <div>
          <Row style={{ marginTop: '15px' }} gutter={8} key="1R">
            <Col span={3} style={{ paddingLeft: 17 }} key="11C">
              Minute
            </Col>
            <Col span={3} style={{ paddingLeft: 22 }} key="12C">
              Hour
            </Col>
            <Col span={3} style={{ paddingLeft: 25 }} key="13C">
              Day
            </Col>
            <Col span={3} style={{ paddingLeft: 17 }} key="14C">
              Month
            </Col>
            <Col span={3} style={{ paddingLeft: 19 }} key="15C">
              Week
            </Col>
          </Row>
          <Row gutter={8} key="2R">
            <Col span={3} key="21C">
              <Input onChange={this.minuteChange}
                     value={this.state.cron[0]}/>
            </Col>
            <Col span={3} key="22C">
              <Input onChange={this.hourChange}
                     value={this.state.cron[1]}/>
            </Col>
            <Col span={3} key="23C">
              <Input onChange={this.dayChange}
                     value={this.state.cron[2]}/>
            </Col>
            <Col span={3} key="24C">
              <Input onChange={this.monthChange}
                     value={this.state.cron[3]}/>
            </Col>
            <Col span={3} key="25C">
              <Input onChange={this.weekChange}
                     value={this.state.cron[4]}/>
            </Col>
          </Row>
          When to End<br/>
          <DatePicker onChange={this.setCronExpressionExpiry} showTime value={this.props.cronExpirationDate} />
        </div>
        }
      </div>
    );
  }
}


export default CronEditor;

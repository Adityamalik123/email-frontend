import React, { Component } from 'react';
import { List, Avatar, Icon } from 'antd';


export default class EmailForm extends Component {
  state = {};

  render() {
    const {
      item,
      showUpdate,
      keys,
    } = this.props;
    console.log(item, 'ir')
    const value = {
      1: 'Type - Once',
      2: 'Type - Cron',
    };
    return (
      <List.Item
        style={{ cursor: 'pointer' }}
        onClick={() => {
          showUpdate(keys);
        }}
      >
        <List.Item.Meta
          avatar={(
            <Avatar size="large" icon="mail" />
          )}
          title={item.subject || 'New Item'}
          description={ `${item.schedule && value[item.schedule.cronChoice]}` }
        />
        <Icon type="right" />
      </List.Item>
    );
  }
}

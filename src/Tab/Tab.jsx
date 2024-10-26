import React from 'react';
import { Tabs, theme } from 'antd';

const arrayTab = ['Search', 'Rated'];

const items = arrayTab.map((i, index) => {
  const id = String(index + 1);
  return {
    label: i,
    key: id,
  };
});

const Tab = ({ handleTabChange }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar
      {...props}
      style={{
        background: colorBgContainer,
      }}
    />
  );

  return (
    <Tabs
      defaultActiveKey="1"
      renderTabBar={renderTabBar}
      items={items}
      onTabClick={(e) => handleTabChange(items[e - 1].label)}
    />
  );
};

export default Tab;

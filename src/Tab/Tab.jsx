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
const Tab = () => {
  const {
    token: { colorBgContainer, horizontalMargin },
  } = theme.useToken();
  const renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar
      {...props}
      style={{
        background: colorBgContainer,
      }}
    />
  );
  return <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} items={items} />;
};
export default Tab;

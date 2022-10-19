import React, { useState } from 'react';
import { Button, Dropdown, Layout, Menu, Typography } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { FileAddOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../services/auth';

import './layout.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function GlobalLayout({ children, login }: any) {
  const { t } = useTranslation();
  const auth = useAuth();
  const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      <Header id='header'>
        {!login && React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => setCollapsed(!collapsed),
        })}
        <Link style={{height: '100%'}} to='/home'>
          <Title id='logo'>Every Place</Title>
        </Link>
        {!login && (auth.loggedIn?
          <Dropdown overlay={<Menu
            items={[
              {
                key: '1',
                label: (
                  <Button type='text' size='small' onClick={() => nav(`/u/profile`)}>{t('layout.profile')}</Button>
                ),
              },
              {
                key: '2',
                label: (
                  <Button type='text' size='small' danger onClick={async () => {
                    await auth.signOut()
                    window.location.reload()
                  }}>{t('layout.logout')}</Button>
                ),
              }
            ]} />} placement="bottomRight">
            <Button id='dropdown-button' ghost icon={<UserOutlined />} />
          </Dropdown>
          :<Button id='signin-button' type='primary' onClick={() => nav('/login')}>Sign In</Button>
        )}
      </Header>
      <Layout className='layout' hasSider >
        {!login && <Sider
          id='sider'
          trigger={null}
          width='160'
          collapsedWidth='50'
          collapsible
          collapsed={collapsed}
          onCollapse={e => setCollapsed(e)}
        >
          <Menu style={{background: 'transparent'}} mode='inline' inlineCollapsed={collapsed} items={[
            { key: 'create', label: 'Create Canvas', disabled: !auth.loggedIn, icon: <FileAddOutlined />, onClick: () => nav('/c/create') },
            { key: 'subbed', label: 'My Canvases', disabled: !auth.loggedIn, icon: <UnorderedListOutlined />, onClick: () => nav(`/u/${auth.user?.username}/canvases`) },
            { key: 'find', label: 'Find Canvas', icon: <SearchOutlined />, onClick: () => nav('/c/search') },
          ]} />
        </Sider>}
        <Content id='content'>
          <div id='content-div'>
            {children}
          </div>
        </Content>
        <Footer id='footer'>
          <Title level={5} id='copyright'>Christian Daga ©2022</Title>
        </Footer>
      </Layout>
    </Layout>
  );
}
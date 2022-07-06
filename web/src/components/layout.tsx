import { Button, Dropdown, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../services/auth';
import './layout.css';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export default function GlobalLayout({ children, login }: any) {
  const { t } = useTranslation();
  const auth = useAuth();
  const nav = useNavigate();

  return (
    <Layout id='layout'>
      <Header id='header'>
        <a style={{height: '100%'}} href='/dashboard'>
          <h1 id='logo'>LOGO</h1>
        </a>
        {!login && (auth.loggedIn?
          <Dropdown overlay={<Menu
            items={[
              {
                key: '1',
                label: (
                  <Button type='text' size='small' onClick={() => nav('/profile')}>{t('layout.profile')}</Button>
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
      <Content id='content'>
        <div id='content-div'>
          {children}
        </div>
      </Content>
      <Footer id='footer'>
        Christian Daga ©2022
      </Footer>
    </Layout>
  );
}
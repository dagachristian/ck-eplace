import { Button, Dropdown, Layout, Menu, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../services/auth';
import './layout.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function GlobalLayout({ children, login }: any) {
  const { t } = useTranslation();
  const auth = useAuth();
  const nav = useNavigate();

  return (
    <Layout id='layout'>
      <Header id='header'>
        <a style={{height: '100%'}} href='/dashboard'>
          <Title id='logo'>Every Place</Title>
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
        <Title level={5} id='copyright'>Christian Daga ©2022</Title>
      </Footer>
    </Layout>
  );
}
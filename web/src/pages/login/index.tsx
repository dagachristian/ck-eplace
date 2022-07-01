import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Form, Checkbox, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../config/auth';

import './login.css';

interface IFormValues {
  username: string,
  password: string,
  remember: boolean
}

export default function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const onSubmit = async (vals: IFormValues) => {
    console.log(vals)
    setIsLoading(true);
    try {
      await signIn(vals.username, vals.password);
    } catch (e) {
      setError('Invalid Credentials');
    }
    setIsLoading(false);
  }

  document.title='Login | CK';
  return (
    <GlobalLayout login>
      <div id='center-div'>
        <div id='bg-image'/>
        <Content id='login-div'>
          <h1 style={{alignSelf:'center', fontSize:'3.2em', fontWeight:'bold'}}>{t('login.signin')}</h1>
          <span style={{color: 'red', fontWeight: 'lighter', margin: '0 0 5px', fontSize:'.7em'}}>{error}</span>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            autoComplete="off"
            id='form-div'
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Username is required' }]}
            >
              <Input placeholder='Username' />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder='Password' />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Divider />
            <Form.Item>
              {isLoading?
                <Button type="primary" icon={<LoadingOutlined />} style={{width: '100%'}} />
                :<Button type="primary" htmlType="submit" style={{width: '100%'}}>
                  Submit
                </Button>
              }
            </Form.Item>
          </Form>
          <Button type="default">
            Register
          </Button>
        </Content>
      </div>
    </GlobalLayout>
  );
}

import { LoadingOutlined } from '@ant-design/icons';
import { Form, Input, Checkbox, Divider, Button } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormContext } from '.';
import { useAuth } from '../../config/auth';

interface IFormValues {
  username: string,
  password: string,
  remember: boolean
}

export default function LoginForm() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [, setShowLogin ] = useContext(FormContext);
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

  return (
    <div id='login-div' className='centered-div'>
      <h1 style={{alignSelf:'center', fontSize:'3em', fontWeight:'bold'}}>{t('login.signin')}</h1>
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
      <Button type="default" onClick={() => setShowLogin(false)}>
        Register
      </Button>
    </div>
  );
}
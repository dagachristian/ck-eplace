import { LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Form, Input, Divider, Button } from 'antd';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormContext } from '.';
import { bffApi } from '../../services/bffApi';

interface IFormValues {
  username: string,
  password: string,
  email: string
}

export default function RegisterForm() {
  const { t } = useTranslation();
  const [, setShowLogin ] = useContext(FormContext);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const onSubmit = async (vals: IFormValues) => {
    console.log(vals)
    setIsLoading(true);
    try {
      await bffApi.register({username: vals.username, password: vals.password, email: vals.email});
      setShowLogin(true);
    } catch (e) {
      setError('User Already Exists');
    }
    setIsLoading(false);
  }

  return (
    <div id='register-div' className='centered-div'>
      <h1 style={{alignSelf:'center', fontSize:'3em', fontWeight:'bold'}}>{t('login.register')}</h1>
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
          hasFeedback
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password placeholder='Password' />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder='Confirm Password' />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Email is required',
            },
          ]}
        >
          <Input placeholder='Email' />
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
      <Button 
        type="link" 
        icon={<LeftOutlined />} 
        onClick={() => setShowLogin(true)} 
        style={{
          width: '110px',
          padding: '0px'
        }}
      >
        Back To Login
      </Button>
    </div>
  );
}
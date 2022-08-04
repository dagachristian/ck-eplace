import { LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Popconfirm } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../services/auth';
import { bffApi } from '../../services/bffApi';

import './profile.css';

const TITLE = 'Profile | Eplace';

interface IFormValues {
  username: string,
  email: string,
  password: string,
  confirm: string,
}

export default function Profile() {
  const auth = useAuth();
  const nav = useNavigate();
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const onSubmit = async (vals: Partial<IFormValues>) => {
    setIsLoading(true);
    try {
      delete vals.confirm;
      const user = await bffApi.updateUser(auth.user?.id!, vals, auth.apiToken!);
      console.log(user)
      sessionStorage.removeItem('token.api');
      nav(`../${user.username}`)
    } catch (e) {
      setError('Failed To Update');
    }
    setIsLoading(false);
  }

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await bffApi.deleteUser(auth.user?.id!, auth.apiToken!);
      await auth.signOut();
      window.location.href = '/';
    } catch (e) {
      setError('Failed To Delete');
    }
    setIsLoading(false);
  }

  return (<>
    <Helmet>
      <title>{auth.user?.username}'s {TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <div id='change-canvas-div'>
        <h1 style={{alignSelf:'center', fontSize:'3em', fontWeight:'bold'}}>{auth.user?.username}'s Profile</h1>
        <span style={{color: 'red', fontWeight: 'lighter', margin: '0 0 5px', fontSize:'.7em'}}>{error}</span>
        <Form
          name='basic'
          onFinish={onSubmit}
          autoComplete='off'
        >
          <Form.Item
            name='username'
            label='Username'
            initialValue={auth.user?.username}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            initialValue={auth.user?.email}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
          >
            <Input.Password placeholder='New Password' />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
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
            <Input.Password placeholder='Confirm New Password' />
          </Form.Item>
          <Divider />
          <Form.Item>
            {isLoading?
              <Button type='primary' icon={<LoadingOutlined />} style={{width: '100%'}} />
              :<Button type='primary' htmlType='submit' style={{width: '100%'}}>
                Update
              </Button>
            }
          </Form.Item>
          {isLoading?
            <Button type='primary' danger icon={<LoadingOutlined />} style={{width: '100%'}} />
            :<Popconfirm title='Confirm Delete' okButtonProps={{danger: true}} onConfirm={onDelete}>
              <Button type='primary' danger style={{width: '100%'}}>
                Delete Account
              </Button>
            </Popconfirm>
          }
        </Form>
      </div>
    </GlobalLayout>
  </>)
}
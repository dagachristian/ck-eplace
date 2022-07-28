import { LoadingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../services/auth';
import { bffApi } from '../../services/bffApi';

import './canvas.css';

const TITLE = 'Create Canvas | Eplace';

interface IFormValues {
  name: string,
  size: number,
  timer: number,
  private: boolean
}

export function CanvasCreate() {
  const auth = useAuth();
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const onSubmit = async (vals: any) => {
    setIsLoading(true);
    try {
      console.log(vals);
      await bffApi.createCanvas(auth.apiToken!, vals);
    } catch (e) {
      setError('Failed To Create');
    }
    setIsLoading(false);
  }

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <div id='create-canvas-div'>
        <h1 style={{alignSelf:'center', fontSize:'3em', fontWeight:'bold'}}>Create Canvas</h1>
        <span style={{color: 'red', fontWeight: 'lighter', margin: '0 0 5px', fontSize:'.7em'}}>{error}</span>
        <Form
          name='basic'
          onFinish={onSubmit}
          autoComplete='off'
        >
          <Form.Item
            name='name'
            label='Name'
          >
            <Input placeholder='Untitled' />
          </Form.Item>
          <Form.Item
            name='size'
            label='Size'
          >
            <InputNumber placeholder='20px' />
          </Form.Item>
          <Form.Item
            name='timer'
            label='Timer'
          >
            <InputNumber placeholder='0s' />
          </Form.Item>
          <Form.Item name='private' valuePropName='checked'>
            <Checkbox>Private</Checkbox>
          </Form.Item>
          <Divider />
          <Form.Item>
            {isLoading?
              <Button type='primary' icon={<LoadingOutlined />} style={{width: '100%'}} />
              :<Button type='primary' htmlType='submit' style={{width: '100%'}}>
                Create
              </Button>
            }
          </Form.Item>
        </Form>
      </div>
    </GlobalLayout>
  </>)
}
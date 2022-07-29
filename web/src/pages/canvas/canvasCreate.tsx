import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../services/auth';
import { bffApi } from '../../services/bffApi';

import './canvas.css';

const TITLE = 'Create Canvas | Eplace';

interface IFormValues {
  name: string,
  size: number,
  timer: number,
  private: boolean,
  subs: string[]
}

export function CanvasCreate() {
  const auth = useAuth();
  const nav = useNavigate();
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const onSubmit = async (vals: Partial<IFormValues>) => {
    setIsLoading(true);
    try {
      console.log(vals);
      const { id } = await bffApi.createCanvas(auth.apiToken!, vals);
      nav(`/c/${id}`)
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
            rules={[{min: 1, type: 'number'},{max: 1080, type: 'number'}]}
          >
            <InputNumber placeholder='20px' />
          </Form.Item>
          <Form.Item
            name='timer'
            label='Timer'
            rules={[{min: 0, type: 'number'}]}
          >
            <InputNumber placeholder='0s' />
          </Form.Item>
          <Form.Item name='private' valuePropName='checked'>
            <Checkbox>Private</Checkbox>
          </Form.Item>
          <Form.List
            name='subs'
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    rules={[
                      {}
                    ]}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger='onBlur'
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Enter username or delete this field",
                        }, {
                          validator: async (_, username) => {
                            if (username) {
                              if (username === auth.user?.username) return Promise.reject('Cannot Invite Yourself');
                              const res = await fetch(bffApi.baseUrl+'/user/'+username);
                              if (!res.ok) return Promise.reject('User does not exist');
                            }
                          }
                        }
                      ]}
                      noStyle
                    >
                      <Input placeholder="username" style={{ width: '60%' }} />
                    </Form.Item>
                    {' '}
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Invite Friends
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
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
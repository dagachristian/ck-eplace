import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, InputNumber, List, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../services/auth';
import { bffApi } from '../../services/bffApi';
import type { ICanvas } from '../../services/interfaces';

import './canvas.css';

const TITLE = 'Edit Canvas | Eplace';

interface IFormValues {
  name: string,
  timer: number,
  private: boolean,
  subs: string[]
}

export function CanvasEdit() {
  const auth = useAuth();
  const params = useParams();
  const nav = useNavigate();
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ canvas, setCanvas ] = useState<ICanvas>();

  const onSubmit = async (vals: Partial<IFormValues>) => {
    setIsLoading(true);
    try {
      console.log(vals);
      vals.subs?.forEach(async id => await bffApi.addSub(id, params.canvasId!, auth.apiToken!))
      delete vals.subs;
      await bffApi.updateCanvas(params.canvasId!, vals, auth.apiToken!);
      nav(`../${params.canvasId}`)
    } catch (e) {
      setError('Failed To Update');
    }
    setIsLoading(false);
  }

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await bffApi.deleteCanvas(params.canvasId!, auth.apiToken!);
      nav('/')
    } catch (e) {
      setError('Failed To Delete');
    }
    setIsLoading(false);
  }

  useEffect(() => {
    bffApi.getCanvas(params.canvasId, auth.apiToken).then(c => setCanvas(c))
  }, [auth.apiToken, params.canvasId])

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <div id='change-canvas-div'>
        <h1 style={{alignSelf:'center', fontSize:'3em', fontWeight:'bold'}}>Update Canvas</h1>
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
            <Input placeholder={canvas?.name} />
          </Form.Item>
          <Form.Item
            name='timer'
            label='Timer'
            rules={[{min: 0, type: 'number'}]}
          >
            <InputNumber placeholder={canvas?.timer + 's'} />
          </Form.Item>
          <Form.Item name='private' valuePropName='checked'>
            <Checkbox defaultChecked={canvas?.private}>Private</Checkbox>
          </Form.Item>
          Subs
          <List 
            dataSource={canvas?.subs}
            style={{maxHeight: '75px'}}
            renderItem={item => (
              <List.Item>{item}</List.Item>
            )}
          />
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
                Update
              </Button>
            }
          </Form.Item>
          {isLoading?
            <Button type='primary' danger icon={<LoadingOutlined />} style={{width: '100%'}} />
            :<Popconfirm title='Confirm Delete' okButtonProps={{danger: true}} onConfirm={onDelete}>
              <Button type='primary' danger style={{width: '100%'}}>
                Delete Canvas
              </Button>
            </Popconfirm>
          }
        </Form>
      </div>
    </GlobalLayout>
  </>)
}
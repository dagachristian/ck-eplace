import { Card, List, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../services/auth';
import { bffApi } from '../../services/bffApi';
import { ICanvas } from '../../services/interfaces';

const { Meta } = Card;
const { TabPane } = Tabs;

const TITLE = 'My Canvases | Eplace';

export function CanvasList() {
  const auth = useAuth();
  const params = useParams();
  const nav = useNavigate();
  const [ myCanvases, setMyCanvases ] = useState<ICanvas[]>();
  const [ subdCanvases, setSubdCanvases ] = useState<ICanvas[]>();
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const getCanvases = async () => {
      const mycnvs = await bffApi.getCanvases({user: params.userId, page: 0}, auth.apiToken!);
      const subdcnvs = await bffApi.getCanvases({user: params.userId, subbed: 'true', page: 0}, auth.apiToken!);
      setMyCanvases(mycnvs.canvases);
      setSubdCanvases(subdcnvs.canvases);
      setIsLoading(false);
    }
    getCanvases();
  }, [auth.apiToken, params.userId, setMyCanvases]);

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <Tabs defaultActiveKey='1' centered size='large'>
        <TabPane tab='Created' key='1'>
          <List
            size='large'
            dataSource={myCanvases}
            loading={isLoading}
            style={{paddingTop: '20px'}}
            grid={{ column: 5 }}
            renderItem={(item: ICanvas) => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img className='pixellated' alt='' src={bffApi.baseUrl! + item.img!} />}
                  onClick={() => nav(`/c/${item.id}`)}
                >
                  <Meta title={item.name} description={`Size: ${item.size}, Timer: ${item.timer}, Private: ${item.private}, Subs: ${item.subs}`} />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane tab='Subbed' key='2'>
          <List
            size='large'
            dataSource={subdCanvases}
            loading={isLoading}
            style={{paddingTop: '20px'}}
            grid={{ column: 5 }}
            renderItem={(item: ICanvas) => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img className='pixellated' alt='' src={bffApi.baseUrl! + item.img!} />}
                  onClick={() => nav(`/c/${item.id}`)}
                >
                  <Meta title={item.name} description={`Size: ${item.size}, Timer: ${item.timer}, Private: ${item.private}, Subs: ${item.subs}`} />
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </GlobalLayout>
  </>)
}
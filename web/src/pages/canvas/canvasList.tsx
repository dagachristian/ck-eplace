import { Avatar, List } from 'antd';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../services/auth';
import { bffApi } from '../../services/bffApi';
import { ICanvas } from '../../services/interfaces';

const TITLE = 'My Canvases | Eplace';

export function CanvasList() {
  const auth = useAuth();
  const params = useParams();
  const [canvases, setCanvases] = useState<ICanvas[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCanvases = async () => {
      const cnvs = await bffApi.getCanvases('', auth.apiToken!);
      setCanvases(cnvs.canvases);
      setIsLoading(false);
    }
    getCanvases();
  }, [auth.apiToken, setCanvases]);

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <List
        size='large'
        dataSource={canvases}
        loading={isLoading}
        style={{padding: '10px'}}
        renderItem={(item: ICanvas) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={bffApi.baseUrl! + item.img!}/>}
              title={<Link to={`/c/${item.id}`}>{item.name}</Link>}
              description={`Size: ${item.size}, Timer: ${item.timer}, Private: ${item.private}`}
            />
          </List.Item>
        )}
      />
    </GlobalLayout>
  </>)
}
import { CaretRightOutlined, SearchOutlined } from '@ant-design/icons';
import { Collapse, Input, List, Select } from 'antd';
import date from 'date-and-time';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import GlobalLayout from '../../components/layout';
import { bffApi } from '../../services/bffApi';
import type { ICanvasResult, IFilters } from '../../services/interfaces';

const TITLE = 'Search Canvas | Eplace';

export function CanvasSearch() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ filters, setFilters ] = useState<Partial<IFilters>>({});
  const [ searchResults, setSearchResults ] = useState<ICanvasResult[]>();

  const search = async () => {
    setIsLoading(true);
    const results = await bffApi.getCanvases(filters);
    setSearchResults(results.canvases);
    setIsLoading(false);
  }

  useEffect(() => {
    search()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <div id='search-div'>
        <div id='search'>
          <Input.Search 
            loading={isLoading}
            enterButton='Search'
            allowClear
            bordered={false}
            prefix={<SearchOutlined />}
            placeholder='Search Canvases'
            onChange={e => setFilters({...filters, query: e.target.value})}
            onSearch={search}
          />
          <Collapse
            bordered={false}
            expandIcon={p => 
              <CaretRightOutlined 
                rotate={p.isActive ? 90 : 0} 
                style={{color: 'var(--tertiary-color)'}}
              />
            } 
            expandIconPosition='end'>
            <Collapse.Panel header='' extra={<span style={{color: 'var(--tertiary-color)'}}>Filter Options</span>} key='1'>
              <div id='filter-options'>
                Creator:
                <Input placeholder='username' onChange={e => setFilters({...filters, user: e.target.value})} />
                SortBy:
                <Select defaultValue='subs' onChange={sort => setFilters({...filters, sortBy: sort})}>
                  <Select.Option value='subs'>subs</Select.Option>
                  <Select.Option value='name'>name</Select.Option>
                  <Select.Option value='size'>size</Select.Option>
                  <Select.Option value='created'>created</Select.Option>
                </Select>
                <Select defaultValue='desc' onChange={order => setFilters({...filters, sortByOrder: order})}>
                  <Select.Option value='desc'>desc</Select.Option>
                  <Select.Option value='asc'>asc</Select.Option>
                </Select>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
        <List
          loading={isLoading}
          pagination={{
            onChange: async page => {
              setFilters({...filters, page})
              await search()
              console.log(page)
            },
            pageSize: 25
          }}
          dataSource={searchResults}
          renderItem={item => (
            <List.Item
              key={item.id}
              extra={<img width={50} className='pixellated' alt='' src={bffApi.baseUrl! + item.img!} />}
            >
              <List.Item.Meta 
                title={<Link to={`/c/${item.id}`}>{item.name}</Link>}
                description={`Creator: ${item.username} Size: ${item.size}, Timer: ${item.timer}, Subs: ${item.subs}, Created ${date.format(new Date(item.created!), 'YYYY/MM/DD HH:mm:ss')}`}
              />
            </List.Item>
          )}
        />
      </div>
    </GlobalLayout>
  </>)
}
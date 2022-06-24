import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, List } from 'antd';
import { useEffect } from 'react';
import date from 'date-and-time';
import { useTranslation } from 'react-i18next';

import styles from './serviceInfo.module.css';
import { bffApi } from '../services/bffApi';
import { useAuth } from '../config/auth';
import { ILogGroup, IService } from '../interfaces';
import { useLogGroupStore } from '../services/state/logGroups';
import { usePopupContext } from './graph';

// const staticlogs = require('./logGroups.json');

export default function ServiceInfo({ service }: {service: IService}) {
  const { t } = useTranslation();
  const auth = useAuth();
  const logGroupStore = useLogGroupStore();
  const logGroups = logGroupStore.logGroups[service.serviceName];
  // const logGroups: ILogGroup[] = staticlogs[service.serviceName];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showModal, setShowModal] = usePopupContext();

  const close = () => {
    setShowModal(false);
  }

  useEffect(() => {
    const getData = async () => {
      const token = (await auth.currentSession())?.apiToken || sessionStorage.getItem('dashboard.token');
      if (!logGroups) {
        console.log('called getloggroups')
        const theLogs = (await bffApi.getLogGroups(service.serviceName, token!))?.logGroups!;
        logGroupStore.addLogGroups(theLogs, service.serviceName);
      }
    }
    console.log(logGroupStore.logGroups)
    getData();
  }, [auth, auth.apiToken, logGroupStore, logGroups, service.serviceName]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content_div}>
        <Button className={styles.exit} type='text' icon={<CloseOutlined />} danger onClick={close}/>
        <h1 className={styles.title}>{service.serviceName}</h1>
        <Divider className={styles.divider} />
        <p className={styles.status}>{t('serviceInfo.status')}:&nbsp;{
          <span style={{color:service.healthStatus.status==='UP'?'green':'red', fontWeight:'bold'}}>
            {service.healthStatus.status}
          </span>
        }</p>
        <p className={styles.contact}>{t('serviceInfo.contactInfo')}: {service.contactInfo?.name} {
          <a href={`mailto:${service.contactInfo?.email}`}>{service.contactInfo?.email}</a>
        }</p>
        <p className={styles.team}>{t('serviceInfo.team')}: {service.team}</p>
        <p className={styles.last_update}>{t('serviceInfo.lastUpdate')}: {
          date.format(new Date(service.lastUpdateTS), 'YYYY/MM/DD HH:mm:ss')
        }</p>
        <p className={styles.error_status}>{t('serviceInfo.logErrorStatus')}:&nbsp;{
          service.logErrorStatus?
            <span style={{color:'red', fontWeight:'bold'}}>{service.logErrorStatus}</span>
            :<span style={{color:'green', fontWeight:'bold'}}>OK</span>
        }&nbsp;{
          service.lastLogEventsWithErrorsTS && 
          date.format(new Date(service.lastLogEventsWithErrorsTS), 'YYYY/MM/DD HH:mm:ss')
        }</p>
        <Divider className={styles.list_divider} orientation='left'>{t('serviceInfo.logGroups')}</Divider>
        {!logGroups?<LoadingOutlined className={styles.loading}/>:
          <List
            className={styles.list}
            dataSource={logGroups}
            renderItem={(logGroup: ILogGroup) => (
              <List.Item className={styles.list_item}>
                <a href={logGroup.logGroupLink} className={styles.log} style={{
                  color:(logGroup.logErrorStatus)?'red':'inherit'
                }}>{logGroup.logGroupName}</a>
                <span style={{marginRight:'5px', fontSize: '12px'}}>{
                  date.format(new Date(logGroup.lastUpdateTS), 'YYYY/MM/DD HH:mm:ss')
                }</span>
              </List.Item>
            )}
          />
        }
      </div>
    </div>
  );
}
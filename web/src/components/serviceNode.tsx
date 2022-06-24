import { CheckCircleTwoTone, ExclamationCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { IService } from '../interfaces';

export default function ServiceNode({ svc }: { svc: IService }) {
  return (
    <div style={{
      width: '115%',
      margin: '-8px 0px -13px -8px',
      display: 'grid',
      gridAutoColumns: '10%'
    }}>
      <h3 style={{
        gridRow: 1,
        gridColumnStart: 2,
        gridColumnEnd: 10,
        justifySelf: 'center'
      }}>{svc.serviceName}</h3>
      {svc.healthStatus.status.match(/^(UP|OK)$/)?<CheckCircleTwoTone twoToneColor="#52c41a" style={{
        gridRow: 1,
        gridColumn: 10,
        justifySelf: 'end',
        fontSize: 10,
        fontWeight: 'bold'
      }}/>:
      <ExclamationCircleTwoTone twoToneColor='red' style={{
        gridRow: 1,
        gridColumn: 10,
        justifySelf: 'end',
        fontSize: 10,
        fontWeight: 'bold'
      }}/>}
      {svc.logErrorStatus && <WarningTwoTone twoToneColor='orange' style={{
        gridRow: 1,
        gridColumn: 10,
        justifySelf: 'end',
        alignSelf: 'end',
        marginBottom: '5px',
        fontSize: 10,
        fontWeight: 'bold'
      }}/>}
    </div>
  )
}
import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Background,
  Controls,
  // MiniMap,
  MarkerType
} from 'react-flow-renderer';
import Popup from 'reactjs-popup';

import { useAuth } from '../config/auth';
import { bffApi } from '../services/bffApi';
import { IService } from '../interfaces';

import ServiceInfo from './serviceInfo';
import { useServiceStore } from '../services/state/services';
import ServiceNode from './serviceNode';

const staticServices = require('./services.json');

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const PopupContext = createContext([] as any);

export default function Flow() {
  const auth = useAuth();
  const serviceStore = useServiceStore();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState({} as IService);
  const [services, setServices] = useState([] as IService[]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedService(services.find((e: any) => e.serviceName === node.data.name)!)
    setShowModal(true);
  }
  const closeModal = () => setShowModal(false)

  useEffect(() => {
    const serviceNodes: Node[] = [];
    const serviceEdges: Edge[] = [];

    const getServices = async () => {
      const token = (await auth.currentSession())?.apiToken || sessionStorage.getItem('dashboard.token');
      // const services = staticServices.services;
      if (!serviceStore.services) {
        console.log('called getservices');
        const theServices = (await bffApi.getServices(token!))?.services!;
        serviceStore.addServices(theServices);
      }
      const services = serviceStore.services;
      const xw = 150;
      const yw = 70;
      let x = -1*xw;
      services?.forEach((svc: IService, i: number) => {
        if ((i%(Math.floor(Math.sqrt(services.length)))) === 0) x+=xw
        serviceNodes.push({ 
          id: svc.serviceName,
          data: { label: <ServiceNode svc={svc}/>, name: svc.serviceName },
          position: { x, y: yw*(i%(Math.floor(Math.sqrt(services.length)))) },
          style: {
            width: 120
          }
        })
        svc.healthStatus.components && Object.keys(svc.healthStatus.components).forEach((dep) => {
          serviceEdges.push({
            id: `${svc.serviceName}-${dep}`,
            source: svc.serviceName,
            target: dep,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed
            }
          })
        })
      })
      setNodes(serviceNodes);
      setEdges(serviceEdges);
      setServices(services!);
    }
    getServices();
  }, [auth, auth.apiToken, serviceStore])

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
      <PopupContext.Provider value={[showModal, setShowModal]}>
        <Popup open={showModal} onClose={closeModal}>
          <ServiceInfo service={selectedService}/>
        </Popup>
      </PopupContext.Provider>
    </>
  )
}

export function usePopupContext() {
  return useContext(PopupContext);
}
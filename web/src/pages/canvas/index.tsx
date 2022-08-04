import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import Canvas from '../../components/canvas';
import GlobalLayout from '../../components/layout';

const TITLE = 'Canvas | Eplace'

export default function CanvasPage() {
  const params = useParams();

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      <Canvas canvasId={params.canvasId} />
    </GlobalLayout>
  </>)
}

export { CanvasEdit } from './canvasEdit';
export { CanvasCreate } from './canvasCreate';
export { CanvasList } from './canvasList';
export { CanvasSearch } from './canvasSearch';
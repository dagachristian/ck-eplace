import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import GlobalLayout from '../../components/layout';

const TITLE = 'Edit Canvas | Eplace';

export function CanvasEdit() {
  const params = useParams();

  return (<>
    <Helmet>
      <title>{TITLE}</title>
    </Helmet>
    <GlobalLayout>
      Edit canvas {params.canvasId} here
    </GlobalLayout>
  </>)
}
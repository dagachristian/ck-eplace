import { Helmet } from 'react-helmet-async';

import GlobalLayout from '../../components/layout';
import Canvas from '../../components/canvas';

import './home.css';

const TITLE = 'Home | EPlace';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <GlobalLayout>
        <Canvas />
      </GlobalLayout>
    </>
  );
}

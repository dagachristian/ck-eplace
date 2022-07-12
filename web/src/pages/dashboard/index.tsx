import { Helmet } from 'react-helmet-async';

import GlobalLayout from '../../components/layout';

import './dashboard.css';

const TITLE = 'Dashboard | CK';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <GlobalLayout>
        This is the dashboard
      </GlobalLayout>
    </>
  );
}

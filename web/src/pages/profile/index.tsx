import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import GlobalLayout from '../../components/layout';

const TITLE = 'Profile | Eplace';

export default function Profile() {
  const params = useParams();

  return (
    <>
      <Helmet>
        <title>{params.userId}'s {TITLE}</title>
      </Helmet>
      <GlobalLayout>
        This is {params.userId}'s profile
      </GlobalLayout>
    </>
  )
}
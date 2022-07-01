import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button } from 'antd';
import { LeftOutlined, ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';

import GlobalLayout from '../../components/layout';
import { useAuth } from '../../config/auth';

import './login.css';

export default function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [ error, setError ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  const onSubmit = async (data: any) => {

  }

  document.title='Login | CK';
  return (
    <GlobalLayout login>
      <div className='center-div'>
        <div className='bg-image'/>
        <div className='login-div'>
          <h1 style={{alignSelf:'center', fontSize:'3.2em', fontWeight:'bold'}}>{t('login.signin')}</h1>
          <Input.Group>
          </Input.Group>
        </div>
      </div>
    </GlobalLayout>
  );
}

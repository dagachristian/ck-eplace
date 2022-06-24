import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";

import Layout from '../components/layout';
import { useAuth } from '../auth/auth';

export default function App() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const { signIn, verifyCode } = useAuth();
  // const onSubmit = data => {
  //   let ref = '/?';
  //   // console.log(data);
  //   Object.entries(data).forEach(([k,v]) => {
  //     ref = ref.concat(`${k}=${v}&`);
  //   });
  //   ref = ref.slice(0,-1);
  //   router.push(ref);
  // }

  const onSubmit = async data => {
    try{
      if (data.code) {
        console.log('attempt verify')
        await verifyCode(data.code)
      } else {
        console.log('attempt signin')
        await signIn(data.email)
      }
    } catch (e) {
      console.log(e)
    }
    
  }
   
  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("firstName", { required: true, maxLength: 20 })} />
        <input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
        <input type="number" {...register("age", { min: 18, max: 99 })} />
        <input type="submit" />
      </form> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email", { required: true })} />
        <input {...register("code")} />
        <input type="submit" />
      </form>
    </Layout>
  );
}
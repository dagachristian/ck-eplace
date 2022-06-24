import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout, { siteTitle } from '../components/layout';
import Date from '../components/date'
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../utils/posts';
import { useStateContext } from './_app';
import { Button } from 'antd';

import 'antd/dist/antd.css';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  const router = useRouter();
  const data = router.query;
  const [state] = useStateContext();

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Have you seen my papers 😏</p>
        <p>
          (This is a sample website - you'll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
        {data.firstName?
          `Welcome ${data.firstName} ${data.lastName} aged ${data.age}!`:
          <Button type='primary' onClick={() => router.push('/login')}>To Login</Button>}
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a className={utilStyles.link}>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <br />
              <small className={utilStyles.lightText}>
                Clicks: {state[`${id}counter`]?state[`${id}counter`]:0}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

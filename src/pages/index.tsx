import Head from 'next/head'
import { HomePage } from '@/components/home/home-page'


export type dataParameter = {
  email: string,
  _id: string,
  id: string,
  categories: string,
  created: string,
  description: string,
  completed: boolean,
  favorite: boolean,
  date: object,
}[];

import { FC } from 'react';
import modifyNote from './modifyNote';

interface Props {
  searchResultState: any;
}



const Home: FC<Props> = ({ searchResultState }) => {

  const [searchResult, setSearchResult] = searchResultState;

  return (
    <>
      <Head>
        <title>To-Do List</title>
        <meta name="description" content="To-Do List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/favicon.ico" />
      </Head>
      <HomePage searchResultState={[searchResult, setSearchResult]} />
    </>
  )
}

export default Home;
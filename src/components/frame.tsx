import { ReactNode, FunctionComponent} from 'react';
type Props = {
  children?: ReactNode
}

import Head from 'next/head';
import Header from './header';
import Footer from './footer'

const Frame :FunctionComponent = (props: Props) => {
    return (
      <>
      <Head>
        <link rel="stylesheet" href="/assets/global.css"></link>
      </Head>
      <Header/>
      <div className="content">
        {props.children}
      </div>
      <Footer/>
      </>
    )
};

export default Frame;
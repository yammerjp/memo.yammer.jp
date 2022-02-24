import { ReactNode, FunctionComponent} from 'react';
import Head from 'next/head';
import Header from './header';
import Footer from './footer'

type Props = {
  children?: ReactNode
  titleIsH1? : boolean
}

const Frame = (props: Props) => {
    return (
      <>
      <Head>
        <link rel="apple-touch-icon" type="image/png" href="/favicon/apple-touch-icon-180x180.png"></link>
        <link rel="icon" type="image/png" href="/favicon/icon-192x192.png"></link>
      </Head>
      <Header titleIsH1={props.titleIsH1}/>
      <div className="content">
        <div className="content-inner">
          {props.children}
        </div>
      </div>
      <Footer/>
      </>
    )
};

export default Frame;

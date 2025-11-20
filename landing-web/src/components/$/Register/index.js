/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import Notice from './Notice';
import Header from './Header';
import Banner from './Banner';
import Content from './Content';
import Bonus from './Bonus';
import Footer from './Footer';
import { _t } from 'utils/lang';
import styles from './style.less';

const Register = () => {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{_t('register.title')}</title>
        <meta name="description" content={_t('register.description')} />
      </Helmet>
      <Notice />
      <Header />
      <Banner />
      <Content />
      <Bonus />
      <Footer />
    </div>
  );
};

export default Register;

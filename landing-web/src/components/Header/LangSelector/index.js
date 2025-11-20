/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, Icon } from 'antd';
import styles from './style.less';

@connect((state) => {
  return {
    langs: state.app.langs,
    currentLang: state.app.currentLang,
  };
})
class LangSelector extends React.Component {
  handleChange = ({ key }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/selectLang',
      payload: {
        lang: key,
      },
    });
  };

  getPopupContainer = () => {
    return document.getElementById('lang_selector');
  };

  render() {
    const {
      langs,
      currentLang,
      showCheckedImg = false,
      checkedImgUrl = undefined,
      filterLangsFn,
    } = this.props;
    const finalLangs = filterLangsFn ? filterLangsFn(langs) : langs;
    const menu = (
      <Menu onClick={this.handleChange}>
        {map(finalLangs, ({ key, label }) => {
          const checked = currentLang === key;
          return (
            <Menu.Item key={key} className={checked ? 'kc-active-lang' : ''}>
              <Fragment>{label}</Fragment>
              <Fragment>
                {showCheckedImg && checkedImgUrl && checked ? (
                  <img
                    className="kc-active-lang-img"
                    alt="kc-active-lang-img"
                    src={checkedImgUrl}
                  />
                ) : (
                  ''
                )}
              </Fragment>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    const currentLangItem = langs.filter(({ key }) => {
      return currentLang === key;
    })[0];

    return (
      <Dropdown overlay={menu} getPopupContainer={this.getPopupContainer} trigger={['click']}>
        <div className={styles.cursor}>
          {currentLangItem?.label} <Icon type="caret-down" />
        </div>
      </Dropdown>
    );
  }
}

const WrapContainer = ({
  className,
  showCheckedImg = false,
  checkedImgUrl = undefined,
  filterLangsFn,
}) => {
  return (
    <div id="lang_selector" className={`${styles.langSelector} ${className}`}>
      <LangSelector
        showCheckedImg={showCheckedImg}
        checkedImgUrl={checkedImgUrl}
        filterLangsFn={filterLangsFn}
      />
    </div>
  );
};

export default WrapContainer;

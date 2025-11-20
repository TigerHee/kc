/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import Html from 'components/common/Html';
import GradientCard from '../module/GradientCard';
import style from './style.less';

const ProjectIntroduction = ({ content }) => {
  return (
    <GradientCard>
      <div className={style.introduction}>
        <Html>{ content }</Html>
      </div>
    </GradientCard>
  );
};

ProjectIntroduction.propTypes = {
  content: PropTypes.string,
};

ProjectIntroduction.defaultProps = {
  content: '',
};

export default ProjectIntroduction;

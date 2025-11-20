/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect } from 'react';
import { useIsMobile } from 'components/Responsive';

import ProjectMotivation from '../Project_Motivation';
import ProjectGoing from '../Project_Going';
import ProjectGuaiDianProjects from '../Project_GuidainProjects';

import style from './style.less';

export default () => {
  const isMobile = useIsMobile();

  useEffect(
    () => {
      let ts = null;
      if (!isMobile) {
        ts = setTimeout(() => {
          const projectLeft = document.querySelector('#project_left');
          if (projectLeft) {
            const target = document.querySelector('#project_right');
            if (target) {
              target.style.maxHeight = projectLeft.getBoundingClientRect().height - 60 + 'px';
            }
          }
        }, 1000);
      }
      return () => {
        if (ts) {
          clearTimeout(ts);
        }
      };
    },
    [isMobile],
  );

  const render = () => {
    if (isMobile) {
      return (
        <div className={style.project_h5}>
          <ProjectMotivation />
          <ProjectGoing />
          <ProjectGuaiDianProjects />
        </div>
      );
    } else {
      return (
        <div className={style.project}>
          <div id="project_left">
            <ProjectMotivation />
            <ProjectGuaiDianProjects />
          </div>
          <div id="project_right">
            <ProjectGoing />
          </div>
        </div>
      );
    }
  };

  return render();
};

/**
 * Owner: will.wang@kupotech.com
 */

import { Accordion, useTheme } from '@kux/mui';
import {
  RoadmapAccordion,
  RoadmapAccordionContentItem,
  RoadmapWrapper,
  RoadmapWrapperTitle,
} from './KucoinRoadmap.style';
import { ICPlusOutlined, ICSubOutlined } from '@kufox/icons';
import { _t, _tHTML } from '@/tools/i18n';

const roadmapConfig = [
  {
    title: '2025 Q1',
    content: _tHTML('aboutus.roadmap.2025.q1'),
  },
  {
    title: '2024 Q4',
    content: _tHTML('aboutus.roadmap.2024.q4'),
  },
  {
    title: '2024 Q3',
    content: _tHTML('aboutus.roadmap.2024.q3'),
  },
  {
    title: '2024 Q2',
    content: _tHTML('aboutus.roadmap.2024.q2'),
  },
  {
    title: '2024 Q1',
    content: _tHTML('aboutus.roadmap.2024.q1'),
  },
  {
    title: '2023 Q4',
    content: _tHTML('aboutus.roadmap.2023.q4'),
  },
  {
    title: '2023 Q3',
    content: _tHTML('aboutus.roadmap.2023.q3'),
  },
];

export default () => {
  const theme = useTheme();

  return (
    <RoadmapWrapper data-inspector="about_us_road_map">
      <RoadmapWrapperTitle>
        {_t('aboutus.trend.title')}
      </RoadmapWrapperTitle>

      <Accordion
        expandIcon={(open) => {
          if (open) {
            return <ICSubOutlined color={theme.colors.text} />;
          }

          return <ICPlusOutlined color={theme.colors.icon60} />;
        }}
        defaultActiveKey="2025 Q1"
        disperion
      >
        {roadmapConfig.map(({ title, content }) => (
          <RoadmapAccordion key={title} header={<h3>{title}</h3>}>
            <RoadmapAccordionContentItem>{content}</RoadmapAccordionContentItem>
          </RoadmapAccordion>
        ))}
      </Accordion>
    </RoadmapWrapper>
  );
};

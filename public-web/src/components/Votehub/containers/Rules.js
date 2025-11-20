/**
 * Owner: jessie@kupotech.com
 */
import QuestionIcon from 'static/votehub/question.svg';
import { _t } from 'tools/i18n';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import { RulesContainer, StyledRules } from '../styledComponents';
import Title from './components/Title';

const Rules = () => {
  return (
    <StyledRules data-inspector="inspector_votehub_rule">
      <Title title={_t('b9hmARke7vQqULYooJpW2r')} coin={QuestionIcon} />
      <RulesContainer>
        <p className="title">{_t('r9URrz3XN4rw7zS3nx8B3z')}</p>
        <p>{_t('uhJURBJv7WVrC2S5XzXh4d')}</p>
        <p>{_t('2nXxigMJPBpWG5ZLSfyxh4')}</p>
        <p>{_t('uyYAmybxwLbDFNrRjayngx')}</p>
      </RulesContainer>
      <AppleDisclaim />
    </StyledRules>
  );
};

export default Rules;

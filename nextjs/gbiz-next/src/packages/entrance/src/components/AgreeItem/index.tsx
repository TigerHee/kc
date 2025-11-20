import { Form } from '@kux/mui';
import { Checkbox } from '@kux/design';
import { Trans } from 'tools/i18n';
import { getTermUrl, getTermId } from 'tools/term';
import styles from './index.module.scss';
import { TSiteConfig } from 'hooks';

const { FormItem } = Form;

type AgreeItemProps = {
  name: string;
  onClick: () => void;
  i18nKey: string;
  initialValue: boolean;
  termCode: string;
  transValues?: Record<string, any>;
  transComponents?: Record<string, any>;
  multiSiteConfig: TSiteConfig | null;
  rules?: any;
};
// 协议 UI
export const AgreeItem = ({
  name,
  onClick,
  i18nKey,
  initialValue,
  termCode,
  // 翻译 values 和 components
  // 如果有传入 transValues、transComponents，则不会使用传入的 termCode
  transValues,
  transComponents,
  multiSiteConfig,
  rules,
}: AgreeItemProps) => {
  return (
    <div className={styles.agreeFormItem}>
      <FormItem name={name} label={null} initialValue={initialValue} valuePropName="checked" rules={rules}>
        <Checkbox defaultChecked={initialValue}>
          <div className={styles.agreeLabel} onClick={e => e.stopPropagation()}>
            <Trans
              i18nKey={i18nKey}
              ns="entrance"
              values={
                transValues || {
                  url: getTermUrl(getTermId(termCode, multiSiteConfig?.termConfig)),
                }
              }
              components={
                transComponents || {
                  a: (
                    <a
                      href={getTermUrl(getTermId(termCode, multiSiteConfig?.termConfig))}
                      target="_blank"
                      rel="noopener noreferrer"
                      // 只有放在这里才执行
                      onClick={onClick}
                    />
                  ),
                }
              }
            />
          </div>
        </Checkbox>
      </FormItem>
    </div>
  );
};

import { TemplateInterface } from 'src/notification/interfaces/template.interface';
import {
  InteractiveConfig,
  InteractiveElement,
  InteractiveHeader,
  LarkInteractiveMessage,
} from 'src/notification/types/lark.types';
import { bindElementsData } from 'src/notification/utils/lark.template.utils';

export class BaseTemplate extends TemplateInterface {
  values: Record<string, any>;
  elements: InteractiveElement[];
  header: InteractiveHeader;
  config: InteractiveConfig;

  /**
   * 解析模板
   * @param elements
   * @param values
   * @returns
   */
  parseElement(): LarkInteractiveMessage['message']['interactive']['elements'] {
    return bindElementsData(this.elements, this.values);
  }

  /**
   * 获取模板
   * @returns
   */
  getTemplate(): LarkInteractiveMessage['message'] {
    return {
      interactive: {
        elements: this.parseElement(),
        header: this.header,
        config: this.config,
      },
    };
  }
}

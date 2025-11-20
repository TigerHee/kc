import { LarkInteractiveMessage } from '../types/lark.types';

export abstract class TemplateInterface {
  abstract values: Record<string, any>;
  abstract elements: LarkInteractiveMessage['message']['interactive']['elements'];
  abstract getTemplate(): LarkInteractiveMessage['message'];
}

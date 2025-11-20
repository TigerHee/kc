import { ComplianceAPI } from 'types/compliance';
import ComplianceTemplate from './compliance.template';
import ComplianceTemplateV1 from './compliance.template.v1';

class Template {
  handler: ComplianceTemplate;
  constructor(data: ComplianceAPI.ComplianceAtomicReportItem) {
    switch (data.version) {
      case 'v1':
        this.handler = new ComplianceTemplateV1(data);
        break;
      default:
        this.handler = new ComplianceTemplateV1(data);
        break;
    }
  }

  getHandler(): ComplianceTemplate {
    return this.handler;
  }
}

export default Template;

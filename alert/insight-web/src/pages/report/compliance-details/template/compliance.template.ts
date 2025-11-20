import { ComplianceAPI } from 'types/compliance';

abstract class ComplianceTemplate {
  template: ComplianceAPI.ComplianceAtomicReportItem;

  constructor(template: ComplianceAPI.ComplianceAtomicReportItem) {
    this.template = template;
  }

  abstract getScanParams(): any;

  abstract getAddingItems(): any;

  abstract getDeletingItems(): any;
}

export default ComplianceTemplate;

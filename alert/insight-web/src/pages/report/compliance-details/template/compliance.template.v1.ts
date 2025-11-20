import { ComplianceAPI } from 'types/compliance';
import ComplianceTemplate from './compliance.template';

class ComplianceTemplateV1 extends ComplianceTemplate {
  constructor(template: ComplianceAPI.ComplianceAtomicReportItem) {
    super(template);
    this.template = template;
  }

  getScanParams(): {
    countryCode: {
      all: string[];
      except: string[];
    };
    scanRepos: string[];
  } {
    let data;
    try {
      data = JSON.parse(this.template.scanParams);
    } catch (error) {
      data = {
        countryCode: {
          all: [],
          except: [],
        },
        scanRepos: [],
      };
    }
    return data;
  }

  getAddingItems(): ComplianceAPI.ComplianceAtomicItem[] {
    let data;
    try {
      data = this.template.addingItems === '' ? [] : JSON.parse(this.template.addingItems);
    } catch (error) {
      data = [];
    }
    return data;
  }

  getDeletingItems(): ComplianceAPI.ComplianceAtomicItem[] {
    let data;
    try {
      console.log('this.template.deletingItems', this.template.deletingItems);
      data = this.template.deletingItems === '' ? [] : JSON.parse(this.template.deletingItems);
    } catch (error) {
      data = [];
    }
    return data;
  }
}

export default ComplianceTemplateV1;

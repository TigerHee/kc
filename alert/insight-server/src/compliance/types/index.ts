import { ComplianceAtomic } from '../schemas/compliance-atomic.schema';
import { ComplianceDemandDocument } from '../schemas/compliance-demand.schema';

export interface ComplianceAtomicListItem extends ComplianceAtomic {
  complianceDemand: ComplianceDemandDocument[];
}

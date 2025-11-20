export interface ComplianceSpmScanResultItem {
  type: 'useCompliantShow' | 'CompliantBox' | 'HardCodeCountryCode';
  position: string;
  line: number;
  column: number;
  path: string;
  spm: string | null;
  repo: string;
  code: string;
  slug: string;
  comment: string;
}

import { getComplianceReportDetail } from '@/services/compliance';
import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';
import { ComplianceAPI } from 'types/compliance';
import ComplianceDetailV1 from './v1';

const ComplianceReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ComplianceAPI.ComplianceAtomicReportItem | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    getComplianceReportDetail(id).then((res) => {
      setData(res);
    });
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return <>{data.version === 'v1' && <ComplianceDetailV1 data={data} />}</>;
};

export default ComplianceReportDetail;

import { useState } from 'react';
import { pullSiteRegions } from 'src/services/kyc';

export default () => {
  const [countries, setCountries] = useState([]);

  const pull = async () => {
    try {
      const { data } = await pullSiteRegions({ kycType: 2 });

      setCountries(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return [countries, pull];
};

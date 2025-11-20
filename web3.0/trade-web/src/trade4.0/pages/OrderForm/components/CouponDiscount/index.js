/*
 * owner: solar@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';

import CouponDialog from './components/CouponDialog/index';
import OpenDialogButton from './components/OpenDialogButton/index';

const StyledDialogContainer = styled.div`
    
`;
export default function CouponDiscount() {
    const [open, setOpen] = useState(false);

    // 是否是现货交易
    const handleOpenClick = useCallback(() => {
        setOpen(true);
    }, []);
    const handleCloseClick = useCallback(() => {
        setOpen(false);
    }, []);

    return (
      <StyledDialogContainer>
        <OpenDialogButton setDialogOpen={handleOpenClick} />
        <CouponDialog open={open} setDialogClose={handleCloseClick} />
      </StyledDialogContainer>
    );
}

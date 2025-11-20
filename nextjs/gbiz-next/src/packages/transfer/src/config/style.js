/**
 * Owner: solar@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledIsolatedLabel = styled.div`
    .main-title {

    }
    .sub-title {
        ${(props) => props.theme.fonts.size.lg}
        color: ${(props) => props.theme.colors.text30};
        margin-top: 2px;
        font-weight: 500;
    }
`;

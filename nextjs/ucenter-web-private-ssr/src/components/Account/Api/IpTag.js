/**
 * Owner: willen@kupotech.com
 */
import { ICCloseFilled } from '@kux/icons';
import { styled } from '@kux/mui';
import { Component } from 'react';

const IpTagWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  height: 36px;
  margin-right: 12px;
  padding: 0 8px;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  line-height: 28px;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  border-radius: 8px;

  .ip-tag-del {
    margin-left: 12px;
    cursor: pointer;
  }
`;

class IpTag extends Component {
  render() {
    const { ip, deletable = false, onDelete, className } = this.props;

    return (
      <IpTagWrapper className={className}>
        {ip}
        {deletable ? (
          <ICCloseFilled size="20" iconId="close2" className="ip-tag-del" onClick={onDelete} />
        ) : null}
      </IpTagWrapper>
    );
  }
}

export default IpTag;

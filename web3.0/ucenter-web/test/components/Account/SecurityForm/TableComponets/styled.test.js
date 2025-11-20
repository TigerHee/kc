import {
  Cell_icon,
  DeviceIcon,
  ExpandIconWrapper,
  ExpandTable,
  MiniTableWrapper,
  NoneContentTip,
  Opt,
  RemoveBtn,
  TableWrapper,
  Title,
  TitleWrapper,
} from 'src/components/Account/SecurityForm/TableComponets/styled';
import { customRender } from 'test/setup';

describe('test TableComponets styled', () => {
  test('test TableComponets styled', () => {
    customRender(<TitleWrapper />);
    customRender(<Title />);
    customRender(<ExpandTable />);
    customRender(<TableWrapper />);
    customRender(<Opt />);
    customRender(<DeviceIcon />);
    customRender(<MiniTableWrapper />);
    customRender(<Cell_icon />);
    customRender(<NoneContentTip />);
    customRender(<RemoveBtn />);
    customRender(<RemoveBtn disabled />);
    customRender(<ExpandIconWrapper />);
  });
});

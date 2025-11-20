/**
 * Owner: iron@kupotech.com
 */
import muiComponents from '@kc/mui/lib/components';
import muiStyles from '@kc/mui/lib/styles';
import hook from '@kc/mui/lib/hook';
import utils from '@kc/mui/lib/utils';
import * as internal from '@kc/mui/lib/internal';
import colors from '@kc/mui/lib/themes/consts/colors';
import connectParams from '@kc/mui/lib/hoc/connectParams';
import connectTheme from '@kc/mui/lib/hoc/connectTheme';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TableContainer from '@material-ui/core/TableContainer';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';
import MuiDialog from '@material-ui/core/Dialog';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import '@kc/mui/lib/svg/svgIcons';

const components = {
  ...muiComponents,
  CircularProgress,
  TableContainer,
  Popover,
  MuiDialog,
};

const themes = {
  consts: {
    colors,
  },
};

const hoc = {
  connectParams,
  connectTheme,
};

const styles = {
  ...muiStyles,
  StylesProvider,
  jssPreset,
  jssCreate: create,
};

export { components, styles, hook, hoc, utils, internal, themes, ClickAwayListener };

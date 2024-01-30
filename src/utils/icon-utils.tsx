/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 19th 2023, 6:57:08 pm
 * Author: Nagendra S @ valmi.io
 */

import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AbcIcon from '@mui/icons-material/Abc';
import LanguageIcon from '@mui/icons-material/Language';
import AppsIcon from '@mui/icons-material/Apps';

import {
  faArrowRight,
  faCalendar,
  faClock,
  faDatabase,
  faLocationPin,
  faMessage,
  faPen,
  faUpload,
  faUser,
  faChartGantt,
  faTrash,
  faCopy,
  faPlus,
  faLink,
  faWater,
  faBolt,
  faArrowLeft,
  faWaveSquare
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface IAppIcons {
  SRC: IconDefinition;
  DEST: IconDefinition;
  WAREHOUSE: IconDefinition;
  DESTINATION: IconDefinition;
  SYNC: IconDefinition;
  STATUS: React.ReactElement;
  STARTED_AT: IconDefinition;
  NAME: React.ReactElement;
  ACCOUNT: IconDefinition;
  SCHEDULE: IconDefinition;
  ARROW_RIGHT: IconDefinition;
  EDIT: IconDefinition;
  UPLOAD: IconDefinition;
  TIME: IconDefinition;
  MESSAGE: IconDefinition;
  TRACK: IconDefinition;
  DELETE: IconDefinition;
  CLIPBOARD: IconDefinition;
  ADD: IconDefinition;
  CONNECTION: IconDefinition;
  STREAM: IconDefinition;
  LIVE_EVENTS: IconDefinition;
  ARROW_LEFT: IconDefinition;
  BROWSER: React.ReactElement;
  APPS: React.ReactElement;
}

const appIcons: IAppIcons = {
  SRC: { ...faDatabase },
  DEST: { ...faLocationPin },
  WAREHOUSE: { ...faDatabase },
  DESTINATION: { ...faLocationPin },
  SYNC: { ...faBolt },
  STATUS: <ToggleOnIcon />,
  STARTED_AT: { ...faClock },
  NAME: <AbcIcon />,
  ACCOUNT: { ...faUser },
  SCHEDULE: { ...faCalendar },
  ARROW_RIGHT: { ...faArrowRight },
  EDIT: { ...faPen },
  UPLOAD: { ...faUpload },
  TIME: { ...faClock },
  MESSAGE: { ...faMessage },
  TRACK: { ...faChartGantt },
  DELETE: { ...faTrash },
  CLIPBOARD: { ...faCopy },
  ADD: { ...faPlus },
  CONNECTION: { ...faLink },
  STREAM: { ...faWater },
  LIVE_EVENTS: { ...faWaveSquare },
  ARROW_LEFT: { ...faArrowLeft },
  BROWSER: <LanguageIcon />,
  APPS: <AppsIcon />
};

export default appIcons;

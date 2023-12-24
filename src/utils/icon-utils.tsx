/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 19th 2023, 6:57:08 pm
 * Author: Nagendra S @ valmi.io
 */

import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AbcIcon from '@mui/icons-material/Abc';

import {
  faArrowRight,
  faCalendar,
  faClock,
  faDatabase,
  faLocationPin,
  faMessage,
  faPen,
  faRotate,
  faUpload,
  faUser
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
}

const appIcons: IAppIcons = {
  SRC: { ...faDatabase },
  DEST: { ...faLocationPin },
  WAREHOUSE: { ...faDatabase },
  DESTINATION: { ...faLocationPin },
  SYNC: { ...faRotate },
  STATUS: <ToggleOnIcon />,
  STARTED_AT: { ...faClock },
  NAME: <AbcIcon />,
  ACCOUNT: { ...faUser },
  SCHEDULE: { ...faCalendar },
  ARROW_RIGHT: { ...faArrowRight },
  EDIT: { ...faPen },
  UPLOAD: { ...faUpload },
  TIME: { ...faClock },
  MESSAGE: { ...faMessage }
};

export default appIcons;

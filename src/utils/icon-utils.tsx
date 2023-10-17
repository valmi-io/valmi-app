/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, May 19th 2023, 6:57:08 pm
 * Author: Nagendra S @ valmi.io
 */

import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AbcIcon from '@mui/icons-material/Abc';

import FontAwesomeIcon from '@components/Icon/FontAwesomeIcon';

export const AppIconARROW_RIGHT = (props: any) => (
  <FontAwesomeIcon {...props} className="fas fa-arrow-right" />
);

const appIcons = {
  SRC: <FontAwesomeIcon className="fas fa-database" />,
  DEST: <FontAwesomeIcon className="fas fa-location-pin" />,
  WAREHOUSE: <FontAwesomeIcon className="fas fa-database" />,
  DESTINATION: <FontAwesomeIcon className="fas fa-location-pin" />,
  SYNC: <FontAwesomeIcon className="fas fa-rotate" />,
  STATUS: <ToggleOnIcon />,
  STARTED_AT: <FontAwesomeIcon className="fas fa-clock" />,
  NAME: <AbcIcon />,
  ACCOUNT: <FontAwesomeIcon className="fas fa-user" />,
  SCHEDULE: <FontAwesomeIcon className="fas fa-calendar" />,
  ARROW_RIGHT: <FontAwesomeIcon className="fas fa-arrow-right" />,
  EDIT: <FontAwesomeIcon className="fa-solid fa-pen" />,
  UPLOAD: <FontAwesomeIcon className="fa-solid fa-upload" />,
  TIME: <FontAwesomeIcon className="fa-solid fa-clock" />,
  MESSAGE: <FontAwesomeIcon className="fa-solid fa-message" />
};

export default appIcons;

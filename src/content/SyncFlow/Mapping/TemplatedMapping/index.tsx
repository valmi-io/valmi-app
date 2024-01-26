/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 1:42:42 pm
 * Author: Nagendra S @ valmi.io
 */

import { useDispatch, useSelector } from 'react-redux';

import MessageIcon from '@mui/icons-material/Message';

import {
  getTemplateMapping,
  updateItemInTemplate
} from '@content/SyncFlow/Mapping/mappingManagement';
import MappingCard from '@content/SyncFlow/Mapping/MappingCard';
import TemplatedFields from '@content/SyncFlow/Mapping/TemplatedMapping/TemplatedFields';

import { setFlowState } from '@store/reducers/syncFlow';
import { RootState } from '@store/reducers';

const TemplatedFieldsContainer = () => {
  const dispatch = useDispatch();
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);

  const saveToStore = (flowState: any) => {
    dispatch(setFlowState(flowState));
  };

  return (
    <MappingCard
      icon={<MessageIcon sx={{ mr: 1 }} />}
      label="Setup Template Field Mappings"
    >
      {/* Templated fields container mapping */}
      <TemplatedFields
        mapping={getTemplateMapping(flowState)}
        mappingUpdated={(index: any, mapObj: any) => {
          saveToStore(updateItemInTemplate(flowState, index, mapObj));
        }}
      />
    </MappingCard>
  );
};

export default TemplatedFieldsContainer;

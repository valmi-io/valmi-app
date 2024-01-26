/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, June 12th 2023, 5:28:44 pm
 * Author: Nagendra S @ valmi.io
 */

import { Box, MenuItem, styled } from '@mui/material';

import {
  getRemainingDestinationFields,
  getSourceFields
} from '@content/SyncFlow/Mapping/mappingManagement';

import DualSelectDropdown from '@components/SelectDropdown/DualSelectDropdown';

const Layout = styled(Box)(({ theme }) => ({
  ...theme.typography.body2
}));

const FieldMapping = (props: any) => {
  const {
    mapping,
    sourceCatalog,
    destinationCatalog,
    mappingUpdated,
    mappingDeleted,
    flowState
  } = props;

  return (
    <Layout>
      {mapping.map((mapObj: any, index: any) => {
        return (
          <DualSelectDropdown
            key={`mapping_key${index}`}
            labelLeft={''}
            valueLeft={mapObj.sourceField}
            onChangeLeft={(event, key) => {
              mappingUpdated(index, {
                ...mapObj,
                sourceField: event.target.value
              });
            }}
            childrenLeft={getSourceFields(sourceCatalog).map(
              (option, index) => {
                return (
                  <MenuItem key={'_sourceMappedkey' + index} value={option}>
                    {option}
                  </MenuItem>
                );
              }
            )}
            labelRight={''}
            valueRight={mapObj.destinationField}
            fieldType={mapObj.destinationFieldType}
            onChangeRight={(event, key) => {
              mappingUpdated(index, {
                ...mapObj,
                destinationField: event.target.value
              });
            }}
            childrenRight={getRemainingDestinationFields(
              flowState,
              destinationCatalog,
              mapping,
              mapObj.destinationField
            ).map((key, index) => (
              <MenuItem key={'_destinationMappedkey' + index} value={key}>
                {key}
              </MenuItem>
            ))}
            disabledRight={mapObj.required ? mapObj.required : false}
            displayDeleteIcon={mapObj.required ? !mapObj.required : true}
            onDeleteIconClick={() => mappingDeleted(index)}
          />
        );
      })}
    </Layout>
  );
};

export default FieldMapping;

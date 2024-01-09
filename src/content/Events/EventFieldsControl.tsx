/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, January 5th 2024, 4:18:57 pm
 * Author: Nagendra S @ valmi.io
 */

import TextFieldDropdown from '@/components/SelectDropdown/TextFieldDropdown';
import CreateEventConnection, { LinkStateType } from '@/content/Events/CreateEventConnection';
import { FormContainer } from '@/layouts/FormLayout';
import { FormStatus } from '@/utils/form-utils';
import { Stack } from '@mui/material';
import { ChangeEvent } from 'react';

type EventsFieldsControlProps = {
  linkState: LinkStateType;
  editing: boolean;
  dataStreams: any;
  dataDestinations: any;
  status?: FormStatus;
  onStreamChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDestinationChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const EventsFieldsControl = ({
  linkState,
  editing = false,
  dataStreams,
  dataDestinations,
  status,
  onStreamChange,
  onDestinationChange
}: EventsFieldsControlProps) => {
  const { fromId, toId, type } = linkState;
  return (
    <FormContainer>
      {!editing && (
        <Stack spacing={2}>
          <TextFieldDropdown
            key={`StreamSelectComponent`}
            label={'Stream'}
            required={true}
            fullWidth
            disabled={false}
            value={fromId}
            onChange={onStreamChange}
            primaryKey="name"
            dataNormalized={{ ids: dataStreams.ids, entities: dataStreams.entities }}
          />

          <TextFieldDropdown
            key={`DestinationSelectComponent`}
            label={'Destination'}
            required={true}
            fullWidth
            disabled={false}
            value={toId}
            onChange={onDestinationChange}
            primaryKey="name"
            dataNormalized={{ ids: dataDestinations.ids, entities: dataDestinations.entities }}
          />
        </Stack>
      )}

      {((fromId && type) || editing) && (
        <CreateEventConnection key={`CreateTrack-${fromId + toId}`} linkState={linkState} />
      )}
    </FormContainer>
  );
};

export default EventsFieldsControl;

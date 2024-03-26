import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, Divider, styled } from '@mui/material';
import { useLazyCreateConnectorQuery } from '@store/api/apiSlice';
import FormFieldText from '@components/FormInput/FormFieldText';

import { RootState } from '@store/reducers';
import { setFlowState } from '@store/reducers/syncFlow';
import { queryHandler } from '@/services';
import {generateSelectedStreamsObject} from '@content/SyncFlow/stateManagement'

const CreateButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom : theme.spacing(2)
  }));


const CreateFieldContainer = ({onSelect, refreshData, setRefreshData}: {onSelect: any, refreshData: any, setRefreshData: any}) => {

  const dispatch = useDispatch();

  const [isCreating, setIsCreating] =  useState(false)
  const [createdValue, setCreatedValue] = useState("")

  const [ createObject, { data, isFetching, isError, error } ] = useLazyCreateConnectorQuery({});

  const appState = useSelector((state: RootState) => state.appFlow.appState);
  /** Redux store */
  const flowState = useSelector((state: RootState) => state.syncFlow.flowState);
  const { currentStep, steps } = flowState;
  const subStep = () => {
    const subStep =steps[currentStep].length-1;
    return subStep
  }


  const connectorType = flowState?.destinationCredentialId?.connector_type;
  const workspaceId = appState?.workspaceId;
  const configData = {
    "Connection" : flowState?.destinationConfig?.name,
    "account" : flowState?.steps[1][1]?.selectedSourceStream,
    "credentials" : flowState?.destinationConfig?.connector_config?.credentials
  }


  const saveToStore = (flowState: any) => {
    dispatch(setFlowState(flowState));
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsCreating(!isCreating)
  };

  const handlecreateFieldValueChange = (event: any) => {
    setCreatedValue(event.target.value)
}

 const generateAuthenticationPayload = (values: any) => {
    let payload: any = {};
    for (const key in values) {
      payload[key] = values[key];
    }
    return payload;
  };
  let successCb = (data:any) => {
    const workspaceID = data.organizations[0].workspaces[0].id;
};
let errorCb  = () => {};
  const createHandler = async ({ query, payload }: { query: any; payload: any }) => {
    await queryHandler({ query, payload, successCb, errorCb });
  };

const handleCreate = async () => {
    console.log("generateSelectedStreamsObject", )
    const config = {...configData, createdValue}
    const payload = generateAuthenticationPayload({connectorType, workspaceId, config})

    createHandler({ query: createObject, payload: payload });
    await createObject(payload);
    setIsCreating(false);
    setRefreshData(true);
  }

  return (
    <>
      {/** Add Create button*/}
        <CreateButton variant="outlined" onClick={handlePopoverOpen}>
         {isCreating ? "Close" : "+ Create"}
        </CreateButton>

        {isCreating &&
        <FormFieldText
        field={{}}
        description={''}
        fullWidth={true}
        label={"Name of the audience group to be created"}
        type="text"
        required={true}
        error={false}
        value={createdValue}
        onChange={handlecreateFieldValueChange}
      />
      }

      {isCreating && <CreateButton variant="contained" onClick={handleCreate}>create</CreateButton>}
    </>
  );
};

export default CreateFieldContainer;

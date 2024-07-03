import { setAppState } from '@store/reducers/appFlow';

export const initialiseAppState = (dispatch, data) => {
  const { workspaceId = '', name = '', email = '', image = '' } = data ?? {};
  dispatch(
    setAppState({
      workspaceId: workspaceId,
      user: {
        email: email,
        name: name,
        image: image
      },
      loginFlowState: 'SUCCESS'
    })
  );
};

export const loginFormSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    promotion: {
      type: 'boolean',
      title: 'Check to receive latest product updates over email',
      const: true,
      // description: 'Select this checkbox to receive emails about new product features and announcements'
      description: ''
    },
    role: {
      type: 'string',
      title: 'You are part of',
      enum: ['Engineering', 'Marketing', 'Finance', 'Sales', 'Operations', 'Other'],
      description: "Select your role from the dropdown menu. If your role isn't listed, choose 'Other'"
    }
  },
  required: ['promotion', 'role']
};

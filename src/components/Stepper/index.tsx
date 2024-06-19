/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import Step from '@mui/material/Step';
import { Card } from '@mui/material';

import StepperComponent from '@components/Stepper/StepperComponent';
import { useWizard } from 'react-use-wizard';

export interface Step {
  label: string;
  type?: string;
}

export interface StepperProps {
  steps: Step[];
  children?: React.ReactNode;
}

const HorizontalLinearStepper = ({ steps, children }: StepperProps) => {
  const { activeStep: wizardActiveStep } = useWizard();
  return (
    <Card sx={{ width: '100%' }}>
      <StepperComponent steps={steps} activeStep={wizardActiveStep} />
      {children}
    </Card>
  );
};

export default HorizontalLinearStepper;

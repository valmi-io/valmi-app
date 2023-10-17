/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

import * as React from 'react';

import Step from '@mui/material/Step';
import { Card } from '@mui/material';

import StepperComponent from '@components/Stepper/StepperComponent';

export interface Step {
  label: string;
}

export interface StepperProps {
  steps: Step[];
  children?: React.ReactNode;
  activeStep: number;
}

const HorizontalLinearStepper = ({
  steps,
  children,
  activeStep
}: StepperProps) => {
  return (
    <Card sx={{ width: '100%' }}>
      <StepperComponent steps={steps} activeStep={activeStep} />
      {children}
    </Card>
  );
};

export default HorizontalLinearStepper;

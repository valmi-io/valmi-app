/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 10th 2023, 5:51:56 pm
 * Author: Nagendra S @ valmi.io
 */

import { Step, StepLabel, Stepper } from '@mui/material';
import React from 'react';

const StepperComponent = (props: any) => {
  const { steps, activeStep } = props;
  return (
    <Stepper activeStep={activeStep}>
      {steps.map((step: any) => (
        <Step key={step.label} completed={false}>
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default React.memo(StepperComponent);

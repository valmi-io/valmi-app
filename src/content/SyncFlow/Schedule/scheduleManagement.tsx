// @ts-nocheck
/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Friday, April 28th 2023, 5:13:16 pm
 * Author: Nagendra S @ valmi.io
 */

const getStep = (flowState) => {
  return flowState.hasOwnProperty('isEditableFlow') && flowState.isEditableFlow
    ? 1
    : 3;
};

const scheduleStep = 0;

export const MIN = 'minute';
export const HOUR = 'hour';
export const getScheduleOptions = () => {
  const options = [
    { value: 1, type: MIN },
    { value: 2, type: MIN },
    { value: 5, type: MIN },
    { value: 15, type: MIN },
    { value: 30, type: MIN },
    { value: 1, type: HOUR },
    { value: 3, type: HOUR },
    { value: 6, type: HOUR },
    { value: 12, type: HOUR },
    { value: 15, type: HOUR },
    { value: 24, type: HOUR }
  ];
  return options;
};

export const getSchedule = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][scheduleStep].hasOwnProperty(
      'scheduleKey'
    )
  )
    return flowState.steps[getStep(flowState)][scheduleStep]['scheduleKey'];
  return null;
};

export const saveSchedule = (flowState, schedule) => {
  const stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][scheduleStep]['scheduleKey'] = schedule;
  return { ...flowState, steps: stepsCopy };
};

export const displaySchedule = (schedule) => {
  if (schedule) {
    return (
      schedule.value + ' ' + schedule.type + (schedule.value > 1 ? 's' : '')
    );
  }
  return '';
};

export const getSyncName = (flowState) => {
  if (
    flowState.steps[getStep(flowState)][scheduleStep].hasOwnProperty('syncName')
  )
    return flowState.steps[getStep(flowState)][scheduleStep]['syncName'];
  return '';
};

export const saveSyncName = (flowState, syncName) => {
  const stepsCopy = flowState.steps.map((x) =>
    x.map((y) => {
      return { ...y };
    })
  );

  stepsCopy[getStep(flowState)][scheduleStep]['syncName'] = syncName;
  return { ...flowState, steps: stepsCopy };
};

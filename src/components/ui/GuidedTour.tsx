import React from 'react';
import { Joyride, Step } from 'react-joyride';

interface GuidedTourProps {
  run: boolean;
  setRun: (run: boolean) => void;
  steps: Step[];
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ run, setRun, steps }) => {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: '#3B82F6',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          overlayColor: 'rgba(0, 0, 0, 0.6)',
        },
        tooltip: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        badge: {
          backgroundColor: '#3B82F6',
        },
        tooltipComponent: {
          padding: '16px',
        },
      }}
      callback={(data: any) => {
        if (data.status === 'finished' || data.status === 'skipped') {
          setRun(false);
        }
      }}
    />
  );
};

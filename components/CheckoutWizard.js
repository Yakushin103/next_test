import React from 'react'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
    >
      {
        ['Login',
          'Shipping Address',
          'Payment Method',
          'Place Order'].map(step => (
            <Step key={step}>
              <StepLabel>
                {step}
              </StepLabel>
            </Step>
          ))
      }
    </Stepper>
  )
}

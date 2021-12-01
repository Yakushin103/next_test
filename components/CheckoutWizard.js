import React from 'react'

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { useStyles } from '../utils/styles'

export default function CheckoutWizard({ activeStep = 0 }) {
  const classes = useStyles()

  return (
    <Stepper
      className={classes.transparentBackground}
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

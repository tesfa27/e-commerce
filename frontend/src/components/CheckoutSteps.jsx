import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const CheckoutSteps = (props) => {
  const steps = [
    { key: 'step1', label: 'Sign In', active: props.step1 },
    { key: 'step2', label: 'Shipping', active: props.step2 },
    { key: 'step3', label: 'Payment', active: props.step3 },
    { key: 'step4', label: 'Place Order', active: props.step4 },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                  step.active
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.active ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Step Label */}
              <span
                className={`ml-3 text-sm font-medium ${
                  step.active ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  steps[index + 1]?.active ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
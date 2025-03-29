// src/components/bookingflow/PassengerDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { BookingTopBar } from './BookingTopBar';
import { BookingSidebar } from './BookingSidebar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { 
  Trip, 
  SpecialRequirements,
  PassengerForm as PassengerFormType,
  BillingDetails as BillingDetailsType
} from '@/types';

interface PassengerDetailsProps {
  trip: Trip;
  initialPassengers: number;
  onComplete: () => void;
}

interface PassengerForm {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  countryCode: string;
  phone: string;
  email: string;
  specialRequirements: {
    dietary: boolean;
    medical: boolean;
    mobility: boolean;
    other: boolean;
    details: string;
  };
}

interface BillingDetails {
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}

const initialPassengerForm: PassengerForm = {
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  countryCode: '+1',
  phone: '',
  email: '',
  specialRequirements: {
    dietary: false,
    medical: false,
    mobility: false,
    other: false,
    details: ''
  }
};

const initialBillingDetails: BillingDetails = {
  country: 'United States',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: ''
};

export default function PassengerDetails({ trip, initialPassengers, onComplete }: PassengerDetailsProps) {
  const [passengers, setPassengers] = useState<PassengerForm[]>(
    Array(initialPassengers).fill(null).map(() => ({ ...initialPassengerForm }))
  );
  const [billingDetails, setBillingDetails] = useState<BillingDetails>(initialBillingDetails);
  const [currentStep, setCurrentStep] = useState(0);
  const [validation, setValidation] = useState<{ [key: string]: string }>({});

  const validateField = (value: string, fieldName: string) => {
    if (!value) return `${fieldName} is required`;
    if (fieldName === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address';
    if (fieldName === 'phone' && !/^\d{10}$/.test(value)) return 'Invalid phone number';
    return '';
  };

  const handleSpecialRequirements = (
    index: number,
    field: keyof SpecialRequirements,
    value: boolean | string
  ) => {
    if (field === 'details') {
      // Handle string value for details
      setPassengers(prev => {
        const updated = [...prev];
        updated[index].specialRequirements[field] = value as string;
        return updated;
      });
    } else {
      // Handle boolean value for checkboxes
      setPassengers(prev => {
        const updated = [...prev];
        updated[index].specialRequirements[field] = value as boolean;
        return updated;
      });
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerForm, value: any) => {
    setPassengers(prev => {
      const updated = [...prev];
      if (field === 'specialRequirements') {
        updated[index] = {
          ...updated[index],
          specialRequirements: {
            ...updated[index].specialRequirements,
            ...value
          }
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return updated;
    });

    // Clear validation error when field is filled
    if (value && typeof value === 'string') {
      setValidation(prev => {
        const updated = { ...prev };
        delete updated[`passenger${index}-${field}`];
        return updated;
      });
    }
  };

  const handleBillingChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when field is filled
    if (value) {
      setValidation(prev => {
        const updated = { ...prev };
        delete updated[`billing-${field}`];
        return updated;
      });
    }
  };

  const validateStep = () => {
    const errors: { [key: string]: string } = {};

    if (currentStep < passengers.length) {
      // Validate passenger details
      const passenger = passengers[currentStep];
      const requiredFields: (keyof PassengerForm)[] = ['title', 'firstName', 'lastName', 'dateOfBirth', 'email'];
      
      if (currentStep === 0) {
        // Additional validation for lead passenger
        requiredFields.push('phone');
      }

      requiredFields.forEach(field => {
        const value = passenger[field] as string;
        const error = validateField(value, field);
        if (error) {
          errors[`passenger${currentStep}-${field}`] = error;
        }
      });
    } else {
      // Validate billing details
      ['addressLine1', 'city', 'state', 'zip'].forEach(field => {
        const error = validateField(billingDetails[field as keyof BillingDetails], field);
        if (error) {
          errors[`billing-${field}`] = error;
        }
      });
    }

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep()) {
      if (currentStep < passengers.length) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Save all passenger and billing details
        const bookingData = {
          passengers,
          billingDetails
        };
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        onComplete();
      }
    }
  };

  return (
    <>
      <BookingTopBar currentStep={2} />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-black">PASSENGER DETAILS</h1>
            <button className="flex items-center gap-2 border rounded-full px-4 py-2">
              <span>FAQs</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1">
              {currentStep < passengers.length ? (
                <PassengerForm
                  passenger={passengers[currentStep]}
                  isLead={currentStep === 0}
                  validation={validation}
                  onChange={(field, value) => handlePassengerChange(currentStep, field, value)}
                />
              ) : (
                <BillingForm
                  billingDetails={billingDetails}
                  validation={validation}
                  onChange={handleBillingChange}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-96">
              <BookingSidebar 
                trip={trip}
                passengers={passengers.length}
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Button
                onClick={handleContinue}
                className="w-full bg-[#17403a] hover:bg-[#0f2d28] text-white h-14 text-lg font-medium"
              >
                {currentStep < passengers.length - 1 
                  ? 'Continue to Next Passenger'
                  : currentStep === passengers.length - 1
                  ? 'Continue to Billing'
                  : 'Continue to Payment'}
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">
                Step {currentStep + 1} of {passengers.length + 1}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface PassengerFormProps {
  passenger: PassengerForm;
  isLead: boolean;
  validation: { [key: string]: string };
  onChange: (field: keyof PassengerForm, value: any) => void;
}

function PassengerForm({ passenger, isLead, validation, onChange }: PassengerFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLead ? 'Lead Passenger' : 'Passenger'} Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title*</label>
            <Select
              value={passenger.title}
              onValueChange={(value) => onChange('title', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr">Mr</SelectItem>
                <SelectItem value="Mrs">Mrs</SelectItem>
                <SelectItem value="Miss">Miss</SelectItem>
                <SelectItem value="Ms">Ms</SelectItem>
                <SelectItem value="Dr">Dr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">First Name*</label>
            <Input
              value={passenger.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Middle Name</label>
            <Input
              value={passenger.middleName}
              onChange={(e) => onChange('middleName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name*</label>
            <Input
              value={passenger.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth*</label>
            <Input
              type="date"
              value={passenger.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
            />
          </div>

          {isLead && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Email*</label>
                <Input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => onChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone*</label>
                <div className="flex gap-2">
                  <Input
                    className="w-24"
                    value={passenger.countryCode}
                    onChange={(e) => onChange('countryCode', e.target.value)}
                  />
                  <Input
                    value={passenger.phone}
                    onChange={(e) => onChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Special Requirements */}
        <div>
          <h3 className="text-lg font-medium mb-4">Special Requirements</h3>
          <div className="space-y-3">
            {['dietary', 'medical', 'mobility', 'other'].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={passenger.specialRequirements[type as keyof typeof passenger.specialRequirements] === true}
                  onChange={(e) => onChange('specialRequirements', { [type]: e.target.checked })}
                  className="w-4 h-4 text-[#17403a] border-gray-300 rounded focus:ring-[#17403a]"
                />
                <label className="ml-2 text-sm text-gray-600 capitalize">
                  {type === 'dietary' ? 'Dietary Requirements' :
                   type === 'medical' ? 'Medical Conditions' :
                   type === 'mobility' ? 'Mobility Requirements' : 'Other'}
                </label>
              </div>
            ))}
            
            <textarea
              placeholder="Please provide details of your requirements..."
              value={passenger.specialRequirements.details}
              onChange={(e) => onChange('specialRequirements', { details: e.target.value })}
              className="mt-2 w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-[#17403a] focus:border-[#17403a]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BillingFormProps {
  billingDetails: BillingDetails;
  validation: { [key: string]: string };
  onChange: (field: keyof BillingDetails, value: string) => void;
}

function BillingForm({ billingDetails, validation, onChange }: BillingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Country*</label>
            <Select
              value={billingDetails.country}
              onValueChange={(value) => onChange('country', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Address Line 1*</label>
            <Input
              value={billingDetails.addressLine1}
              onChange={(e) => onChange('addressLine1', e.target.value)}
            />
            {validation['billing-addressLine1'] && (
              <p className="text-sm text-red-500 mt-1">{validation['billing-addressLine1']}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Address Line 2</label>
            <Input
              value={billingDetails.addressLine2}
              onChange={(e) => onChange('addressLine2', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City*</label>
            <Input
              value={billingDetails.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
            {validation['billing-city'] && (
              <p className="text-sm text-red-500 mt-1">{validation['billing-city']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <Select
              value={billingDetails.state}
              onValueChange={(value) => onChange('state', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AL">Alabama</SelectItem>
                <SelectItem value="AK">Alaska</SelectItem>
                <SelectItem value="AZ">Arizona</SelectItem>
                <SelectItem value="AR">Arkansas</SelectItem>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="CO">Colorado</SelectItem>
                <SelectItem value="CT">Connecticut</SelectItem>
                <SelectItem value="DE">Delaware</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
                <SelectItem value="HI">Hawaii</SelectItem>
                <SelectItem value="ID">Idaho</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                <SelectItem value="IN">Indiana</SelectItem>
                <SelectItem value="IA">Iowa</SelectItem>
                <SelectItem value="KS">Kansas</SelectItem>
                <SelectItem value="KY">Kentucky</SelectItem>
                <SelectItem value="LA">Louisiana</SelectItem>
                <SelectItem value="ME">Maine</SelectItem>
                <SelectItem value="MD">Maryland</SelectItem>
                <SelectItem value="MA">Massachusetts</SelectItem>
                <SelectItem value="MI">Michigan</SelectItem>
                <SelectItem value="MN">Minnesota</SelectItem>
                <SelectItem value="MS">Mississippi</SelectItem>
                <SelectItem value="MO">Missouri</SelectItem>
                <SelectItem value="MT">Montana</SelectItem>
                <SelectItem value="NE">Nebraska</SelectItem>
                <SelectItem value="NV">Nevada</SelectItem>
                <SelectItem value="NH">New Hampshire</SelectItem>
                <SelectItem value="NJ">New Jersey</SelectItem>
                <SelectItem value="NM">New Mexico</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="NC">North Carolina</SelectItem>
                <SelectItem value="ND">North Dakota</SelectItem>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="OK">Oklahoma</SelectItem>
                <SelectItem value="OR">Oregon</SelectItem>
                <SelectItem value="PA">Pennsylvania</SelectItem>
                <SelectItem value="RI">Rhode Island</SelectItem>
                <SelectItem value="SC">South Carolina</SelectItem>
                <SelectItem value="SD">South Dakota</SelectItem>
                <SelectItem value="TN">Tennessee</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="UT">Utah</SelectItem>
                <SelectItem value="VT">Vermont</SelectItem>
                <SelectItem value="VA">Virginia</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="WV">West Virginia</SelectItem>
                <SelectItem value="WI">Wisconsin</SelectItem>
                <SelectItem value="WY">Wyoming</SelectItem>
              </SelectContent>
            </Select>
            {validation['billing-state'] && (
              <p className="text-sm text-red-500 mt-1">{validation['billing-state']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code*</label>
            <Input
              value={billingDetails.zip}
              onChange={(e) => onChange('zip', e.target.value)}
            />
            {validation['billing-zip'] && (
              <p className="text-sm text-red-500 mt-1">{validation['billing-zip']}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

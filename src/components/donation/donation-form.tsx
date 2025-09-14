'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, CreditCard, Gift, Repeat, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'amount' | 'details' | 'payment'>('amount')
  const [formData, setFormData] = useState({
    amount: 0,
    frequency: 'one-time',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isAnonymous: false,
    dedication: ''
  })

  const presetAmounts = [25, 50, 100, 250, 500, 1000]
  const frequencyOptions = [
    { value: 'one-time', label: 'One-time', icon: Gift },
    { value: 'monthly', label: 'Monthly', icon: Repeat },
    { value: 'quarterly', label: 'Quarterly', icon: Repeat },
    { value: 'yearly', label: 'Yearly', icon: Repeat },
  ]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setFormData(prev => ({ ...prev, amount }))
  }

  const handleFrequencyChange = (frequency: string) => {
    setFormData(prev => ({ ...prev, frequency }))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      alert('Thank you for your donation! You will receive a confirmation email shortly.')
      
      // Reset form
      setFormData({
        amount: 0,
        frequency: 'one-time',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isAnonymous: false,
        dedication: ''
      })
      setSelectedAmount(null)
      setCurrentStep('amount')
    } catch (error) {
      alert('There was an error processing your donation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 'amount') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep('payment')
    }
  }

  const prevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('amount')
    } else if (currentStep === 'payment') {
      setCurrentStep('details')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { step: 'amount', label: 'Amount', icon: Heart },
              { step: 'details', label: 'Details', icon: User },
              { step: 'payment', label: 'Payment', icon: CreditCard }
            ].map((step, index) => {
              const isActive = currentStep === step.step
              const isCompleted = 
                (step.step === 'amount' && currentStep !== 'amount') ||
                (step.step === 'details' && currentStep === 'payment')
              
              return (
                <div key={step.step} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    isActive && "border-orange-500 bg-orange-500 text-white",
                    isCompleted && "border-green-500 bg-green-500 text-white",
                    !isActive && !isCompleted && "border-gray-300 bg-white text-gray-500"
                  )}>
                    {React.createElement(step.icon, { className: "h-5 w-5" })}
                  </div>
                  <span className={cn(
                    "ml-2 text-sm font-medium",
                    isActive && "text-orange-600",
                    isCompleted && "text-green-600",
                    !isActive && !isCompleted && "text-gray-500"
                  )}>
                    {step.label}
                  </span>
                  {index < 2 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-4",
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Amount Selection */}
          {currentStep === 'amount' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Choose Your Impact
                  </CardTitle>
                  <p className="text-gray-600">Every dollar makes a difference in a dog's life</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                          selectedAmount === amount
                            ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        )}
                      >
                        <div className="text-2xl font-bold">${amount}</div>
                        <div className="text-sm opacity-80">
                          {amount === 25 && "Feed a dog for a week"}
                          {amount === 50 && "Medical checkup"}
                          {amount === 100 && "Emergency treatment"}
                          {amount === 250 && "Complete rehabilitation"}
                          {amount === 500 && "Save a life"}
                          {amount === 1000 && "Transform a life"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Or enter custom amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.amount || ''}
                        onChange={(e) => handleAmountSelect(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Donation Frequency</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {frequencyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleFrequencyChange(option.value)}
                          className={cn(
                            "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-300",
                            formData.frequency === option.value
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-gray-200 bg-white hover:border-orange-300"
                          )}
                        >
                          {React.createElement(option.icon, { className: "h-4 w-4" })}
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedAmount}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold"
                  >
                    Continue to Details
                    <Heart className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Your Information
                  </CardTitle>
                  <p className="text-gray-600">Help us keep you updated on your impact</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                        Make this donation anonymous
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Dedication (Optional)</label>
                      <textarea
                        placeholder="Dedicate this donation to a special dog or person..."
                        value={formData.dedication}
                        onChange={(e) => handleInputChange('dedication', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 'payment' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Complete Your Donation
                  </CardTitle>
                  <p className="text-gray-600">Review your donation and complete the payment</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donation Summary */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Donation Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">${formData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-semibold capitalize">{formData.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donor:</span>
                        <span className="font-semibold">
                          {formData.isAnonymous ? 'Anonymous' : `${formData.firstName} ${formData.lastName}`}
                        </span>
                      </div>
                      {formData.dedication && (
                        <div className="pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Dedication:</span>
                          <p className="text-sm text-gray-700 mt-1">{formData.dedication}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-6 w-6 text-gray-500" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Complete Donation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  )
}
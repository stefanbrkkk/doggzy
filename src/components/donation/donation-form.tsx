'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, CreditCard, Gift, Repeat, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function DonationForm() {
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
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with Stripe
      console.log('Donation data:', formData)
      
      // Show success message
      alert(`Thank you for your ${formData.frequency === 'one-time' ? '$' + formData.amount : '$' + formData.amount + ' ' + formData.frequency} donation!`)
      
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {['amount', 'details', 'payment'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                currentStep === step 
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50" 
                  : index < ['amount', 'details', 'payment'].indexOf(currentStep)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={cn(
                  "w-16 h-1 mx-2 transition-all duration-300",
                  index < ['amount', 'details', 'payment'].indexOf(currentStep) 
                    ? "bg-green-500" 
                    : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
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
                        <div className="text-sm opacity-75">
                          {amount === 25 && "Feeds a dog for a week"}
                          {amount === 50 && "Covers medical checkup"}
                          {amount === 100 && "Pays for vaccinations"}
                          {amount === 250 && "Covers spay/neuter"}
                          {amount === 500 && "Emergency medical care"}
                          {amount === 1000 && "Complete rescue package"}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Custom Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                        value={selectedAmount && !presetAmounts.includes(selectedAmount) ? selectedAmount : ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value)
                          if (value > 0) {
                            handleAmountSelect(value)
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Donation Frequency</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {frequencyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleFrequencyChange(option.value)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2",
                            formData.frequency === option.value
                              ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                              : "border-gray-200 bg-white hover:border-orange-300"
                          )}
                        >
                          <option.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('details')}
                      disabled={!selectedAmount}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/75"
                    >
                      Continue to Details
                    </Button>
                  </div>
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
                      <label className="block text-sm font-medium text-gray-700">First Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dedication (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Dedicate this donation to someone special..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500"
                      value={formData.dedication}
                      onChange={(e) => handleInputChange('dedication', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      Make this donation anonymous
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('amount')}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/75"
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
                  <p className="text-gray-600">Secure payment powered by Stripe</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Donation Summary */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Donation Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">${formData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frequency:</span>
                        <span className="font-semibold capitalize">{formData.frequency.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-semibold">{formData.isAnonymous ? 'Anonymous' : `${formData.firstName} ${formData.lastName}`}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${formData.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-orange-300 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="h-6 w-6 text-gray-600" />
                        <span className="font-medium">Credit Card</span>
                      </button>
                      <button
                        type="button"
                        className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-orange-300 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Heart className="h-6 w-6 text-gray-600" />
                        <span className="font-medium">PayPal</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('details')}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/75 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
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
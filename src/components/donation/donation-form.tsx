'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heart, CreditCard, Gift, Repeat, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least $1'),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  dedication: z.string().optional(),
})

type DonationFormData = z.infer<typeof donationSchema>

const presetAmounts = [25, 50, 100, 250, 500, 1000]
const frequencyOptions = [
  { value: 'one-time', label: 'One-time', icon: Gift },
  { value: 'monthly', label: 'Monthly', icon: Repeat },
  { value: 'quarterly', label: 'Quarterly', icon: Repeat },
  { value: 'yearly', label: 'Yearly', icon: Repeat },
]

export function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'amount' | 'details' | 'payment'>('amount')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      frequency: 'one-time',
      isAnonymous: false,
    },
  })

  const watchedFrequency = watch('frequency')

  const onSubmit = async (data: DonationFormData) => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would integrate with Stripe
      console.log('Donation data:', data)
      
      // Show success message
      alert(`Thank you for your ${data.frequency === 'one-time' ? '$' + data.amount : '$' + data.amount + ' ' + data.frequency} donation!`)
      
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setValue('amount', amount)
    setCurrentStep('details')
  }

  const handleCustomAmount = () => {
    setSelectedAmount(null)
    setCurrentStep('details')
  }

  const getFrequencyMultiplier = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 12
      case 'quarterly': return 4
      case 'yearly': return 1
      default: return 1
    }
  }

  const getTotalImpact = () => {
    const amount = selectedAmount || 0
    const multiplier = getFrequencyMultiplier(watchedFrequency)
    return amount * multiplier
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {['amount', 'details', 'payment'].map((step, index) => (
            <div key={step} className="flex items-center">
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === step || ['amount', 'details', 'payment'].indexOf(currentStep) > index
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
                animate={{
                  scale: currentStep === step ? 1.1 : 1,
                }}
              >
                {index + 1}
              </motion.div>
              {index < 2 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2",
                  ['amount', 'details', 'payment'].indexOf(currentStep) > index
                    ? "bg-orange-500"
                    : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <p className="text-gray-600">
                    Every dollar makes a difference in a dog's life
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {presetAmounts.map((amount) => (
                      <motion.button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-300 font-semibold",
                          selectedAmount === amount
                            ? "border-orange-500 bg-orange-500 text-white shadow-lg"
                            : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ${amount}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <motion.button
                    type="button"
                    onClick={handleCustomAmount}
                    className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors duration-300 font-medium text-gray-600 hover:text-orange-600"
                    whileHover={{ scale: 1.02 }}
                  >
                    Enter Custom Amount
                  </motion.button>

                  {/* Impact Preview */}
                  {selectedAmount && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/80 rounded-lg p-4 text-center"
                    >
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        ${selectedAmount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Could provide {Math.floor(selectedAmount / 15)} days of food for a rescue dog
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Donation Details */}
          {currentStep === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Heart className="h-6 w-6 text-orange-500" />
                    Donation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Frequency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Donation Frequency
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {frequencyOptions.map((option) => (
                        <motion.label
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                            watchedFrequency === option.value
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register('frequency')}
                            className="sr-only"
                          />
                          <option.icon className="h-5 w-5 text-orange-500" />
                          <span className="font-medium">{option.label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Dedication */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dedication (Optional)
                    </label>
                    <textarea
                      {...register('dedication')}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="In memory of a beloved pet, or a special message..."
                    />
                  </div>

                  {/* Anonymous Donation */}
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      {...register('isAnonymous')}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">
                      Make this donation anonymous
                    </span>
                  </label>

                  {/* Impact Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6"
                  >
                    <h3 className="font-semibold text-lg mb-3">Your Impact</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Donation Amount:</span>
                        <span className="font-semibold">
                          ${selectedAmount || 'Custom'}
                          {watchedFrequency !== 'one-time' && ` ${watchedFrequency}`}
                        </span>
                      </div>
                      {watchedFrequency !== 'one-time' && (
                        <div className="flex justify-between">
                          <span>Annual Total:</span>
                          <span className="font-semibold text-orange-600">
                            ${getTotalImpact()}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-orange-200">
                        <div className="text-center">
                          <div className="text-orange-600 font-semibold">
                            {Math.floor((selectedAmount || 100) / 15)} days of food
                          </div>
                          <div className="text-xs text-gray-600">
                            for a rescue dog
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep('amount')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('payment')}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
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
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-orange-500" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border-2 border-orange-500 rounded-xl bg-orange-50">
                      <CreditCard className="h-6 w-6 text-orange-500" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </div>

                  {/* Card Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Your payment information is encrypted and secure. We use Stripe for payment processing.
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep('details')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

'use client'

import React from 'react'
import { Heart, Shield, Globe, Users, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function DonatePage() {
  const [amount, setAmount] = React.useState(25)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleDonate = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Thank you for your donation!')
    } catch (error) {
      alert('Error processing donation')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
              Make a Difference Today
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Save a Life
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Make a Donation
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              Every dollar you donate goes directly to rescuing, rehabilitating, and rehoming dogs in need. 
              Join thousands of compassionate donors making miracles happen every day.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: "Secure & Tax-Deductible",
                description: "All donations are processed securely and are tax-deductible under 501(c)(3)"
              },
              {
                icon: Globe,
                title: "Global Impact",
                description: "Your donation helps rescue dogs across 47 countries through our partner network"
              },
              {
                icon: Users,
                title: "Transparent Use",
                description: "98% of donations go directly to rescue operations, medical care, and rehabilitation"
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="hover:transform hover:-translate-y-1 transition-transform duration-150"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-150 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Donation Form */}
          <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  Choose Your Impact
                </h2>
                <p className="text-gray-600">Every dollar makes a difference in a dog's life</p>
              </div>

              {/* Amount Selection */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[25, 50, 100, 250, 500, 1000].map((presetAmount) => (
                    <button
                      key={presetAmount}
                      type="button"
                      onClick={() => setAmount(presetAmount)}
                      className={`p-4 rounded-xl border-2 transition-all duration-150 hover:scale-101 ${
                        amount === presetAmount
                          ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                          : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                    >
                      <div className="text-2xl font-bold">${presetAmount}</div>
                      <div className="text-sm opacity-80">
                        {presetAmount === 25 && "Feed a dog for a week"}
                        {presetAmount === 50 && "Medical checkup"}
                        {presetAmount === 100 && "Emergency treatment"}
                        {presetAmount === 250 && "Complete rehabilitation"}
                        {presetAmount === 500 && "Save a life"}
                        {presetAmount === 1000 && "Transform a life"}
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
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                    />
                  </div>
                </div>

                {/* Donate Button */}
                <Button
                  onClick={handleDonate}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      Donate ${amount}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
                Our Impact
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              See the real difference we're making in the lives of dogs worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "50,000+", label: "Dogs Rescued", icon: Heart },
              { number: "156", label: "Partner Shelters", icon: Users },
              { number: "47", label: "Countries", icon: Globe },
              { number: "98%", label: "Success Rate", icon: CreditCard }
            ].map((stat) => (
              <div
                key={stat.label}
                className="hover:transform hover:-translate-y-1 transition-transform duration-150"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-150 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mb-4">
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6">
              Urgent: Dogs Need Your Help Right Now
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Every day, hundreds of dogs are abandoned, abused, or left to die. 
              Your donation today could literally save a life tomorrow.
            </p>
            <button 
              onClick={() => {
                const formElement = document.querySelector('form')
                if (formElement) {
                  formElement.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-150 shadow-lg"
            >
              <Heart className="h-5 w-5 inline mr-2" />
              Donate Now - Save a Life
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
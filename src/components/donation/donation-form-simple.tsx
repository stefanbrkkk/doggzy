'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function DonationFormSimple() {
  const [amount, setAmount] = useState(25)

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Make a Donation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">
                Choose your donation amount
              </p>
              <div className="flex gap-4 justify-center">
                {[25, 50, 100, 250].map((presetAmount) => (
                  <Button
                    key={presetAmount}
                    variant={amount === presetAmount ? "default" : "outline"}
                    onClick={() => setAmount(presetAmount)}
                    className="px-6 py-3"
                  >
                    ${presetAmount}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold">
              <Heart className="h-5 w-5 mr-2" />
              Donate ${amount}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default DonationFormSimple

'use client'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Globe, Mail, Phone, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Data Protection",
      content: "We implement industry-standard security measures to protect your personal information."
    },
    {
      icon: Lock,
      title: "Secure Transactions",
      content: "All donations and purchases are processed through encrypted, PCI-compliant systems."
    },
    {
      icon: Eye,
      title: "Transparency",
      content: "We clearly communicate how your data is used and give you control over your information."
    },
    {
      icon: Globe,
      title: "Global Compliance",
      content: "We comply with GDPR, CCPA, and other international privacy regulations."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Shield className="h-4 w-4 fill-blue-500 text-blue-500" />
              Privacy & Security
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white mb-4"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <section.icon className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-gray-600">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 lg:p-12">
                <div className="prose prose-lg max-w-none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Last Updated: January 2024</h2>
                    
                    <p className="text-gray-700 mb-6">
                      Doggzy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
                      explains how we collect, use, disclose, and safeguard your information when you visit our 
                      website or use our services.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1. Information We Collect</h3>
                    
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h4>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>Name, email address, and phone number</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely through Stripe)</li>
                      <li>Donation history and preferences</li>
                      <li>Communication preferences</li>
                    </ul>

                    <h4 className="text-lg font-medium text-gray-900 mb-3">Automatically Collected Information</h4>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring website information</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2. How We Use Your Information</h3>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>Process donations and merchandise purchases</li>
                      <li>Send donation receipts and tax documentation</li>
                      <li>Provide customer support</li>
                      <li>Send updates about rescued dogs and our mission</li>
                      <li>Improve our website and services</li>
                      <li>Comply with legal obligations</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3. Information Sharing</h3>
                    <p className="text-gray-700 mb-4">
                      We do not sell, trade, or rent your personal information to third parties. We may share 
                      your information only in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>With service providers who assist in our operations (payment processors, email services)</li>
                      <li>When required by law or to protect our rights</li>
                      <li>With your explicit consent</li>
                      <li>In case of a merger or acquisition (with notice to users)</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4. Data Security</h3>
                    <p className="text-gray-700 mb-6">
                      We implement appropriate technical and organizational measures to protect your personal 
                      information against unauthorized access, alteration, disclosure, or destruction. This includes 
                      encryption, secure servers, and regular security audits.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">5. Your Rights (GDPR/CCPA)</h3>
                    <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>Access to your personal information</li>
                      <li>Correction of inaccurate information</li>
                      <li>Deletion of your personal information</li>
                      <li>Restriction of processing</li>
                      <li>Data portability</li>
                      <li>Objection to processing</li>
                      <li>Withdrawal of consent</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">6. Cookies and Tracking</h3>
                    <p className="text-gray-700 mb-6">
                      We use cookies and similar technologies to enhance your experience, analyze site usage, 
                      and personalize content. You can control cookie settings through your browser preferences.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">7. Third-Party Services</h3>
                    <p className="text-gray-700 mb-6">
                      Our website may contain links to third-party websites. We are not responsible for the 
                      privacy practices of these external sites. We encourage you to review their privacy policies.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">8. Children&apos;s Privacy</h3>
                    <p className="text-gray-700 mb-6">
                      We do not knowingly collect personal information from children under 13. If you believe 
                      we have collected information from a child, please contact us immediately.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">9. International Transfers</h3>
                    <p className="text-gray-700 mb-6">
                      Your information may be transferred to and processed in countries other than your own. 
                      We ensure appropriate safeguards are in place to protect your information in accordance 
                      with this Privacy Policy.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">10. Changes to This Policy</h3>
                    <p className="text-gray-700 mb-6">
                      We may update this Privacy Policy from time to time. We will notify you of any changes 
                      by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">11. Contact Us</h3>
                    <p className="text-gray-700 mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">privacy@doggzy.org</span>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <Phone className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">Data Protection Officer: privacy@doggzy.org</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-green-800 mb-2">Your Privacy Matters</h4>
                      <p className="text-green-700">
                        We are committed to protecting your privacy and being transparent about our data practices. 
                        Your trust is essential to our mission of helping rescue dogs worldwide.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

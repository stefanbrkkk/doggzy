'use client'

export const dynamic = 'force-dynamic'

import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function TestLangPage() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Multi-Language Test Page
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Current Language: <span className="font-semibold text-orange-600">{language.toUpperCase()}</span>
            </p>
            <LanguageSwitcher />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Navigation Test */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Navigation</h2>
              <div className="space-y-2">
                <p><strong>Home:</strong> {t.nav.home}</p>
                <p><strong>Donate:</strong> {t.nav.donate}</p>
                <p><strong>Shop:</strong> {t.nav.shop}</p>
                <p><strong>Sponsor a Pet:</strong> {t.nav.sponsor}</p>
                <p><strong>Our Impact:</strong> {t.nav.impact}</p>
                <p><strong>Partners:</strong> {t.nav.partners}</p>
                <p><strong>About:</strong> {t.nav.about}</p>
                <p><strong>Donate Now:</strong> {t.nav.donateNow}</p>
              </div>
            </div>

            {/* Home Page Test */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Home Page</h2>
              <div className="space-y-3">
                <p><strong>Hero Badge:</strong> {t.home.hero.badge}</p>
                <p><strong>Hero Title:</strong> {t.home.hero.title}</p>
                <p><strong>Hero Title Highlight:</strong> {t.home.hero.titleHighlight}</p>
                <p><strong>Hero Subtitle:</strong> {t.home.hero.subtitle}</p>
                <p><strong>Donate Button:</strong> {t.home.hero.donateButton}</p>
                <p><strong>Learn More Button:</strong> {t.home.hero.learnMoreButton}</p>
              </div>
            </div>

            {/* Donate Page Test */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Donate Page</h2>
              <div className="space-y-3">
                <p><strong>Hero Badge:</strong> {t.donate.hero.badge}</p>
                <p><strong>Hero Title:</strong> {t.donate.hero.title}</p>
                <p><strong>Hero Title Highlight:</strong> {t.donate.hero.titleHighlight}</p>
                <p><strong>Hero Subtitle:</strong> {t.donate.hero.subtitle}</p>
                <p><strong>Form Title:</strong> {t.donate.form.title}</p>
                <p><strong>Form Subtitle:</strong> {t.donate.form.subtitle}</p>
              </div>
            </div>

            {/* Shop Page Test */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Shop Page</h2>
              <div className="space-y-3">
                <p><strong>Hero Badge:</strong> {t.shop.hero.badge}</p>
                <p><strong>Hero Title:</strong> {t.shop.hero.title}</p>
                <p><strong>Hero Title Highlight:</strong> {t.shop.hero.titleHighlight}</p>
                <p><strong>Hero Subtitle:</strong> {t.shop.hero.subtitle}</p>
                <p><strong>Search Placeholder:</strong> {t.shop.hero.searchPlaceholder}</p>
                <p><strong>Cart Title:</strong> {t.shop.cart.title}</p>
              </div>
            </div>

            {/* Common Words Test */}
            <div className="bg-white rounded-lg p-6 shadow-lg md:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">Common Words</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p><strong>Loading:</strong> {t.common.loading}</p>
                  <p><strong>Error:</strong> {t.common.error}</p>
                  <p><strong>Try Again:</strong> {t.common.tryAgain}</p>
                  <p><strong>Learn More:</strong> {t.common.learnMore}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Close:</strong> {t.common.close}</p>
                  <p><strong>Next:</strong> {t.common.next}</p>
                  <p><strong>Previous:</strong> {t.common.previous}</p>
                  <p><strong>Submit:</strong> {t.common.submit}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Cancel:</strong> {t.common.cancel}</p>
                  <p><strong>Save:</strong> {t.common.save}</p>
                  <p><strong>Edit:</strong> {t.common.edit}</p>
                  <p><strong>Delete:</strong> {t.common.delete}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Add:</strong> {t.common.add}</p>
                  <p><strong>Remove:</strong> {t.common.remove}</p>
                  <p><strong>View:</strong> {t.common.view}</p>
                  <p><strong>Back:</strong> {t.common.back}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Switch languages using the language switcher above to see all text change!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

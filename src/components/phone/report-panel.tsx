'use client'

import { PhoneFrame } from './phone-frame'
import { ReportFlow } from './report-flow'
import { submitReport } from '@/lib/report-client'

/**
 * The report app, as used on its own page. Split out so the page itself can
 * stay a server component and only this island ships to the browser.
 */
export function ReportPanel() {
  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <PhoneFrame label="Prijava psa" tilt={false}>
        <ReportFlow onSubmit={submitReport} />
      </PhoneFrame>
    </div>
  )
}

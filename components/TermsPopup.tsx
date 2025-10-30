'use client'
import { useState } from 'react'

export default function TermsPopup({ onAgree }: { onAgree: () => void }) {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white max-w-lg rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Terms & Conditions</h2>
        <div className="text-sm text-gray-700 space-y-3 max-h-72 overflow-y-auto">
          <p>Welcome to <strong>DailyEarn PH</strong>. By using this platform, you agree to the following:</p>
          <ul className="list-disc list-inside">
            <li>A <strong>5% service fee</strong> applies to each completed transaction to support platform operations.</li>
            <li>All earnings are treated as <strong>independent freelance income</strong> under Philippine law (not employer-employee).</li>
            <li>Users are responsible for their own <strong>tax filings</strong> and compliance with BIR and DOLE freelance regulations.</li>
            <li>Posting, accepting, or completing a gig implies full consent to these terms.</li>
          </ul>
          <p className="text-xs text-gray-600">These terms follow DTI & DOLE guidelines on online freelancing and digital work platforms.</p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setOpen(false)}
            className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
          >
            Decline
          </button>
          <button
            onClick={() => {
              setOpen(false)
              onAgree()
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            I Agree and Understand
          </button>
        </div>
      </div>
    </div>
  )
}

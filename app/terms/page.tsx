import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Terms of Service | Kingdom Missions Center International",
  description: "Terms of Service for Kingdom Missions Center International website and services.",
}

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-dark-blue mb-8">Terms of Service</h1>

            <div className="prose prose-lg max-w-none text-dark-blue/80 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using the Kingdom Missions Center International (KMCI) website,
                  you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials on KMCI's
                  website for personal, non-commercial transitory viewing only. This is the grant
                  of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on KMCI's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">3. Disclaimer</h2>
                <p>
                  The materials on KMCI's website are provided on an 'as is' basis. KMCI makes no
                  warranties, expressed or implied, and hereby disclaims and negates all other warranties
                  including without limitation, implied warranties or conditions of merchantability,
                  fitness for a particular purpose, or non-infringement of intellectual property or
                  other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">4. Limitations</h2>
                <p>
                  In no event shall KMCI or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising
                  out of the use or inability to use the materials on KMCI's website, even if KMCI or a
                  KMCI authorized representative has been notified orally or in writing of the possibility
                  of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">5. Donations and Payments</h2>
                <p>
                  All donations made through our website are voluntary and non-refundable unless
                  required by law. KMCI reserves the right to refuse or return any donation at our
                  discretion. By making a donation, you confirm that you are the rightful owner of
                  the funds being donated.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">6. User Content</h2>
                <p>
                  By submitting content to our website (including contact forms, comments, or
                  testimonials), you grant KMCI a non-exclusive, worldwide, royalty-free license
                  to use, reproduce, and distribute such content for our ministry purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">7. Privacy</h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also
                  governs your use of the website, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">8. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the
                  laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the
                  courts in that State or location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">9. Changes to Terms</h2>
                <p>
                  KMCI reserves the right to revise these terms of service at any time without notice.
                  By using this website, you are agreeing to be bound by the then current version of
                  these terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">10. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-white p-6 rounded-lg border border-gold/20 mt-4">
                  <p className="font-semibold text-dark-blue">Kingdom Missions Center International</p>
                  <p>Email: info@kmci.org</p>
                  <p>Phone: +254 XXX XXX XXX</p>
                  <p>Address: [Church Address], Kenya</p>
                </div>
              </section>

              <div className="text-sm text-dark-blue/60 mt-12 pt-8 border-t border-gold/20">
                <p>Last updated: December 1, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

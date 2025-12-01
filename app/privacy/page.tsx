import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata = {
  title: "Privacy Policy | Kingdom Missions Center International",
  description: "Privacy Policy for Kingdom Missions Center International website and services.",
}

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-dark-blue mb-8">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none text-dark-blue/80 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">1. Introduction</h2>
                <p>
                  Kingdom Missions Center International (KMCI) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                  when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-medium text-dark-blue mb-3">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Register for events or programs</li>
                  <li>Make donations or payments</li>
                  <li>Contact us through forms or email</li>
                  <li>Subscribe to our newsletters</li>
                  <li>Create an account on our website</li>
                </ul>
                <p className="mt-4">This information may include:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and contact information</li>
                  <li>Email address and phone number</li>
                  <li>Payment and billing information</li>
                  <li>Emergency contact details</li>
                  <li>Dietary restrictions or special needs</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-medium text-dark-blue mb-3">Automatically Collected Information</h3>
                <p>We may automatically collect certain information when you visit our website:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>IP address and browser information</li>
                  <li>Device and operating system details</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Process donations and event registrations</li>
                  <li>Send you newsletters and ministry updates</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect against fraud and unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">4. Information Sharing and Disclosure</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who help us operate our website and services</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Ministry Partners:</strong> With authorized ministry partners for specific programs or events (with your consent)</li>
                  <li><strong>Emergency Situations:</strong> To protect the vital interests of any person</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                  However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">6. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience on our website.
                  You can choose to accept or decline cookies through your browser settings. Declining
                  cookies may prevent you from taking full advantage of our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">7. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for
                  the privacy practices or content of these external sites. We encourage you to review
                  the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">8. Children's Privacy</h2>
                <p>
                  Our services are not directed to children under 13 years of age. We do not knowingly
                  collect personal information from children under 13. If we become aware that we have
                  collected such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">9. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your personal information</li>
                  <li>Lodge a complaint with appropriate authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">10. Data Retention</h2>
                <p>
                  We retain your personal information only for as long as necessary to fulfill the
                  purposes outlined in this Privacy Policy, unless a longer retention period is
                  required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">11. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the "Last updated"
                  date below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-dark-blue mb-4">12. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices,
                  please contact us at:
                </p>
                <div className="bg-white p-6 rounded-lg border border-gold/20 mt-4">
                  <p className="font-semibold text-dark-blue">Kingdom Missions Center International</p>
                  <p>Privacy Officer</p>
                  <p>Email: privacy@kmci.org</p>
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

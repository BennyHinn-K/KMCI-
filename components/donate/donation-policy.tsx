import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileText, TrendingUp } from "lucide-react"

export function DonationPolicy() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Our Commitment to You</h2>
            <p className="text-lg text-muted-foreground">Transparency and accountability in all we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Secure & Safe</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All donations are processed through secure, encrypted payment systems. Your information is protected.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">Tax Deductible</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  KMCI is a registered non-profit. You will receive a tax-deductible receipt for your donation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground">100% Impact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every donation goes directly to ministry. We provide regular updates on how your gift is making a
                  difference.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-muted/50 p-8 rounded-lg">
            <h3 className="font-serif font-bold text-xl text-foreground mb-4">Donation Policy</h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>Refund Policy:</strong> All donations are final. However, if you believe an error has occurred,
                please contact us within 30 days at info@kmci.org.
              </p>
              <p>
                <strong>Designated Gifts:</strong> Donations designated for specific projects will be used for those
                purposes. If a project is fully funded, excess funds will be used for similar ministry needs.
              </p>
              <p>
                <strong>Recurring Donations:</strong> You can cancel recurring donations at any time by contacting us.
                Changes take effect in the next billing cycle.
              </p>
              <p>
                <strong>Privacy:</strong> We respect your privacy and will never sell or share your information with
                third parties. Anonymous donations will not be publicly acknowledged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-serif font-bold text-xl mb-4">KMCI</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              A Centre of Transformation, Mission, and Hope. Discipling communities and transforming lives for Christ's
              service.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ministries" className="hover:text-accent transition-colors">
                  Ministries
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="hover:text-accent transition-colors">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Kinoo/Muthiga, Kiambu County, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@kmci.org</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs font-semibold mb-1">Service Times</p>
              <p className="text-xs text-primary-foreground/80">Sunday: 9:00 AM - 12:00 PM</p>
              <p className="text-xs text-primary-foreground/80">Wednesday: 6:00 PM - 8:00 PM</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay Connected</h4>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Subscribe to our newsletter for updates and inspiration.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
          <p>&copy; {currentYear} Kingdom Missions Center International. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

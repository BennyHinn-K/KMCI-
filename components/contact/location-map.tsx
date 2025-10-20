export function LocationMap() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 lg:px-8 h-full flex flex-col">
        <div className="mb-8">
          <h2 className="font-serif font-bold text-3xl text-foreground mb-3">Find Us</h2>
          <p className="text-muted-foreground">Located in Kinoo/Muthiga, Kiambu County, Kenya</p>
        </div>

        {/* Map Placeholder */}
        <div className="flex-1 min-h-[400px] bg-muted rounded-lg overflow-hidden border-2 border-border">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-3 p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Interactive Map</p>
                <p className="text-sm text-muted-foreground">Map integration coming soon</p>
              </div>
              <div className="pt-4">
                <a
                  href="https://maps.google.com/?q=Kinoo+Muthiga+Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Open in Google Maps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

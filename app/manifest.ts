import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kingdom Missions Center International",
    short_name: "KMCI",
    description: "A Centre of Transformation, Mission, and Hope",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3ed",
    theme_color: "#1e3a5f",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

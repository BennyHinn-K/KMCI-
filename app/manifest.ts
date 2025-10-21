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
        src: "/icon-192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  }
}

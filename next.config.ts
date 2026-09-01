import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "mpa.rociodopazo.com" }],
          destination: "/mpa",
        },
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "publishinghouse.magiaparaatrevidos.com",
            },
          ],
          destination: "/mpa/publishing-house",
        },
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "straysheep.magiaparaatrevidos.com",
            },
          ],
          destination: "/stray-sheep",
        },
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "dima.magiaparaatrevidos.com",
            },
          ],
          destination: "/dima",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

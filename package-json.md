{
  "name": "tls-cert-expiry-radar",
  "version": "1.0.0",
  "description": "Monitor TLS/SSL certificates and prevent outages with beautiful visual dashboards",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "scan": "node scripts/scan-local.js",
    "export": "next build && next export"
  },
  "keywords": [
    "tls",
    "ssl",
    "certificate",
    "monitoring",
    "security",
    "devops",
    "expiry",
    "radar",
    "dashboard"
  ],
  "author": {
    "name": "Ali AlEnezi",
    "email": "Site@hotmail.com",
    "url": "https://3li.info"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/SiteQ8/tls-cert-expiry-radar"
  },
  "bugs": {
    "url": "https://github.com/SiteQ8/tls-cert-expiry-radar/issues"
  },
  "homepage": "https://siteq8.github.io/tls-cert-expiry-radar",
  "license": "MIT",
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "recharts": "^2.10.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "date-fns": "^3.0.0",
    "tls": "^0.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/leaflet": "^1.9.8",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}

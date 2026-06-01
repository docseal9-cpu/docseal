# DocSeal

DocSeal is a high-security, Zero-Knowledge architecture digital vault designed to protect your most sensitive assets and digital legacy. It features military-grade encryption directly in the browser and an intelligent multi-signature Emergency Recovery System.

## Features

- **Zero-Knowledge Architecture:** Your Master Password never leaves your device. The server only ever receives and stores ciphertext.
- **Client-Side Encryption:** All files are encrypted using `AES-256-GCM` via the Web Crypto API before being uploaded.
- **Dual-Key Emergency Recovery:** A secure "Dead Man's Switch" alternative. Generate two unique 64-character Emergency Codes for trusted contacts. Both codes must be combined to cryptographically unlock the vault without the Master Password.
- **Strict Identity Verification:** Emergency recovery requires exact matching of the trusted contacts' Name, Email, and Phone Number alongside the access tokens.
- **Minimalist Interface:** A clean, distraction-free UI built with React.

## Tech Stack

- **Frontend:** React, Vite, Web Crypto API
- **Backend:** Node.js, Express.js
- **Database & Storage:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage)

## Getting Started

### Prerequisites

- Node.js (v16+)
- A Supabase Project (URL and Anon Key)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/docseal9-cpu/pdd.git
   cd pdd
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file in the `server` directory and add your Supabase credentials (SUPABASE_URL, SUPABASE_KEY).*
   
   Start the server:
   ```bash
   npm start
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file in the `client` directory and add your Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).*
   
   Start the development server:
   ```bash
   npm run dev
   ```

## Security Note

This project is built for educational purposes and demonstrates advanced client-side cryptography, key derivation (PBKDF2), and secure session management.

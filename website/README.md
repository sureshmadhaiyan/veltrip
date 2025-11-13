# Veltrip Website

Multi-tenant cab service booking website built with Vue 3, inspired by GT Holidays design.

## Features

- 🎨 **Dynamic Theming** - Each company can have its own theme (colors, logo, branding)
- 🏢 **Multi-Tenant Support** - Works for all travel/cab companies
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🔐 **User Authentication** - Login/Register functionality
- 💰 **Tariff Display** - Transparent pricing information
- 📞 **Contact Forms** - Easy communication
- 🚗 **Booking System** - Quick ride booking interface

## Pages

- **Home** - Hero banner, features, services, statistics
- **Login** - User authentication
- **Tariff** - Pricing tables for different services
- **Contact** - Contact form and information
- **Book Ride** - Booking interface

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update API URL in .env
VITE_API_URL=http://localhost:3000

# Start development server
npm run dev

# Build for production
npm run build
```

## Multi-Tenant Configuration

The website automatically detects the company based on:
- Subdomain (e.g., `company.veltrip.com`)
- Domain (e.g., `company.com`)

Company data and theme are loaded dynamically from the backend API.

## Theme Customization

Each company can customize:
- Primary color
- Secondary color
- Accent color
- Logo
- Banner text
- Company name

Theme data is stored in the Company model's `theme` JSON field.

## Tech Stack

- Vue 3 (Composition API)
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)
- Vite (Build Tool)

## API Integration

The website connects to the NestJS backend API for:
- Company information
- User authentication
- Booking management
- Theme data

## Development

```bash
# Run dev server
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

The website will be available at `http://localhost:5173`

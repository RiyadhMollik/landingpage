# Bangladesh Maps Landing Page

A Next.js application for selling digital maps of Bangladesh with bKash payment integration.

## Features

- Product display with pricing
- Secure payment processing with bKash
- Admin dashboard for order and product management
- Order tracking and management
- CSV export for orders

## Tech Stack

- Next.js 14
- React
- MySQL with Sequelize ORM
- Tailwind CSS
- bKash Payment Gateway

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MySQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=bangladesh_maps

# JWT Secret
JWT_SECRET=your_jwt_secret

# bKash API Credentials
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
BKASH_BASE_URL=https://checkout.sandbox.bka.sh/v1.2.0-beta
```

4. Initialize the database:

```bash
node src/scripts/initDb.js
```

5. Run the development server:

```bash
npm run dev
```

## Admin Access

After initializing the database, you can access the admin panel at `/admin/login` with the following credentials:

- Username: admin
- Password: admin123

## Project Structure

- `/src/app` - Next.js application routes
- `/src/components` - Reusable React components
- `/src/models` - Sequelize database models
- `/src/config` - Configuration files
- `/src/middleware` - Authentication middleware
- `/src/scripts` - Database initialization scripts

## API Routes

- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/payment/bkash` - bKash payment integration

## Testing

To test the system:

1. Start the development server
2. Visit the homepage and click on "Download Now"
3. Fill out the purchase form and submit
4. Complete the bKash payment flow
5. Check the admin dashboard for the new order

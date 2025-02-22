# Next.js 15 Project Template

This is a modern [Next.js](https://nextjs.org) project template with TypeScript, Zod validation, Drizzle ORM, and ShadCN UI components.

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18.17 or later
- MySQL database (local or hosted)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <your-project-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Install required packages:
```bash
# Install Zod for validation
npm install zod

# Install Drizzle ORM and toolkit
npm install drizzle-orm drizzle-kit

# Install ShadCN UI components
npx shadcn-ui@latest init
```

4. Set up your environment variables by creating a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:3306/your_database"

# Add other environment variables as needed
```

2. Generate and run migrations:
```bash
# Generate migration
npx drizzle-kit generate:mysql

# Push to database
npx drizzle-kit push:mysql
```

## Development

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Next.js 15**: Latest features and improvements
- **TypeScript**: Full type safety
- **Zod**: Runtime type validation
- **Drizzle ORM**: Type-safe database queries
- **ShadCN UI**: Beautiful and customizable UI components
- **MySQL Database**: Reliable data storage
- **API Routes**: Built-in API functionality

## Best Practices

- Use Zod schemas for validating API inputs
- Implement proper error handling
- Follow TypeScript best practices
- Keep components modular and reusable
- Use ShadCN UI components for consistent design

## Deployment

This project can be deployed on [Railway](https://railway.app/):

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Configure your environment variables
4. Railway will automatically deploy your application

## Learn More

To learn more about the technologies used in this template:

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Zod Documentation](https://zod.dev)
- [ShadCN UI Documentation](https://ui.shadcn.com)

## Speec Engineering
- [Spec Engineering](https://www.notion.so/Engineering-Spec-To-Do-List-App-1a2650cc859880e5a932c1f51b8f9ea0?pvs=4)


# FarmVision - Local Development Setup

FarmVision is an AI-powered chat application designed to assist users with agricultural queries through text and image-based interactions. This guide will help you set up the FarmVision frontend for local development.

## Prerequisites

1. **Node.js & npm**
   - Download and install Node.js (LTS version recommended) from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git**
   - Install Git from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

3. **Text Editor**
   - Recommended: [VS Code](https://code.visualstudio.com/)

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ilvoirr/farmvision.git
cd farmvision
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# OR using yarn (if you have yarn installed)
# yarn install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Required for Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Required for Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Set development port (default: 3000)
PORT=3000
```

### 4. Obtaining API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env.local` file

#### Clerk Authentication
1. Sign up at [Clerk.dev](https://clerk.dev/)
2. Create a new application
3. Copy your publishable and secret keys to the `.env.local` file

### 5. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

The project follows a clean and organized structure:

```
farmvision/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── apppage/        # Main application pages
│   └── ...
├── components/         # Reusable React components
│   ├── ui/             # UI components
│   └── ...
├── public/             # Static files
├── lib/                # Utility functions
└── ...
```

## Common Issues & Solutions

1. **Port Already in Use**
   ```bash
   # Find the process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **Environment Variables Not Loading**
   - Ensure the file is named exactly `.env.local`
   - Restart your development server after making changes
   - Check for typos in variable names

3. **Module Not Found**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Run linter:
   ```bash
   npm run lint
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

5. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

## Need Help?

If you encounter any issues during setup, please:
1. Check the [GitHub Issues](https://github.com/ilvoirr/farmvision/issues) page
2. Create a new issue if your problem isn't listed
3. Include error messages and steps to reproduce the issue

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

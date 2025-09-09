# FarmVision

FarmVision is an AI-powered chat application designed to assist users with agricultural queries through text and image-based interactions. The application features a modern, responsive interface with support for multiple languages and image recognition capabilities powered by Google's Gemini AI.

### Key Features

- **AI-Powered Chat**: Interactive chat interface with natural language processing
- **Image Recognition**: Upload images for AI analysis and get insights
- **Multilingual Support**: Switch between English and Hindi for a localized experience
- **Real-time Typing Indicators**: Visual feedback when the AI is responding
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and user management using Clerk

### Technology Stack

- **Next.js 14**: Modern React framework for server-side rendering
- **TypeScript**: For type-safe development
- **React**: Core UI library
- **Clerk Authentication**: For secure user management
- **Google Gemini AI**: For natural language processing and image recognition
- **Tailwind CSS**: For styling and responsive design
- **Particles.js**: For interactive background effects

### Getting Started

1. First, clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/farmvision.git
cd farmvision
```

2. Install all necessary dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables by creating a `.env` file:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

The project follows a clean and organized structure:

```
app/
├── api/              # API routes for Gemini integration
├── apppage/          # Main application page
├── fonts.ts          # Font configurations
└── layout.tsx        # Root layout component
components/          # Reusable React components
public/              # Static assets like images
lib/                 # Utility functions and configurations
```

### Key Components

- **Chat Interface**: Interactive chat window with message history
- **Image Upload**: Drag-and-drop or click-to-upload image functionality
- **Language Toggle**: Switch between English and Hindi
- **Typing Indicators**: Visual feedback during AI response generation
- **Responsive Layout**: Adapts to different screen sizes

### API Endpoints

The application uses the following API endpoints:

- **/api/gemini**: Handles both text and image-based queries
- **/api/elevation**: (Planned) For elevation data related to farming
- **/api/location**: (Planned) For location-based services

### Contributing

We welcome contributions to FarmVision! Here's how to get started:

1. Fork the repository on GitHub
2. Create a new feature branch:
```bash
git checkout -b feature/your-feature-name
```
3. Make your changes and commit them:
```bash
git commit -m 'Add your feature description'
```
4. Push to your branch and create a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
4. Push your changes to your fork:
```bash
git push origin feature/your-feature-name
```
5. Create a Pull Request on the main repository

### License

This project is licensed under the MIT License - see the LICENSE file for details

### Support

For support, please open an issue in the GitHub repository or contact the maintainers directly

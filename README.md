# 🎩 ContentGen Pro - AI-Powered Magic Tricks App

A modern, full-stack web application that generates personalized magic tricks using AI, complete with user authentication, media management, and an intuitive interface.

![ContentGen Pro](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.0-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-cyan) ![Supabase](https://img.shields.io/badge/Supabase-2.0.0-green) ![Claude AI](https://img.shields.io/badge/Claude_AI-3.5-orange)

## ✨ Features

### 🎭 AI-Powered Magic Trick Generation
- **Intelligent Trick Creation**: Uses Claude AI to generate custom magic tricks based on available items
- **Item Selection**: Choose from 15+ common household items
- **Difficulty Levels**: Easy, Medium, and Hard difficulty options
- **Personalized Content**: Tricks tailored to your skill level and available materials

### 🔐 User Authentication & Profiles
- **Secure Authentication**: Supabase-powered user management
- **Profile Management**: Edit bio, upload profile pictures
- **Session Persistence**: Maintains login state across browser sessions
- **Profile Pictures**: Upload and manage profile images with Supabase storage

### 🖼️ Media Gallery
- **Image & Video Upload**: Support for multiple media formats
- **Storage Management**: Organized file storage with Supabase buckets
- **Grid Layout**: Beautiful, responsive gallery display
- **File Management**: View, delete, and organize your media

### 🎪 Magic Tricks Library
- **Trick Collection**: Browse and manage your magic tricks
- **Interactive Cards**: Click to reveal trick instructions
- **Difficulty Filtering**: Filter tricks by difficulty level
- **Personal Collection**: View tricks you've created vs. community tricks

### 📱 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Sleek, modern dark interface
- **Smooth Animations**: Engaging transitions and hover effects
- **Intuitive Navigation**: Easy-to-use interface with clear navigation

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### Backend & Services
- **Supabase** - Backend-as-a-Service for authentication and database
- **Claude AI** - Anthropic's AI for magic trick generation
- **PostgreSQL** - Database for user data and magic tricks
- **Supabase Storage** - File storage for images and videos

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** - [Sign up here](https://supabase.com)
- **Claude API key** - [Get it here](https://console.anthropic.com)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AkhilKumar-Git/magic-tricks--app.git
cd magic-tricks--app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude AI Configuration
VITE_CLAUDE_API_KEY=your_claude_api_key
```

### 4. Database Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Run the SQL scripts from `database-scripts.sql` in the SQL Editor
4. This will create the necessary tables and storage buckets

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🗄️ Database Schema

### Tables
- **users** - User profiles and authentication data
- **magic_tricks** - Magic tricks created by users
- **Storage Buckets**:
  - `profile_pictures` - User profile images
  - `user_videos` - User uploaded media files

### Key Features
- **Row Level Security (RLS)** - Secure data access
- **Real-time Updates** - Live data synchronization
- **File Storage** - Organized media file management

## 🎯 Usage

### Getting Started
1. **Sign Up/Login** - Create an account or sign in
2. **Complete Profile** - Add your bio and profile picture
3. **Generate Tricks** - Use AI to create custom magic tricks
4. **Manage Media** - Upload and organize your images/videos
5. **Practice & Perform** - Learn and master your tricks

### AI Trick Generation
1. Click "Generate a Trick" on the Magic Tricks page
2. Select available items from the grid
3. Choose difficulty level (Easy/Medium/Hard)
4. Let Claude AI create a custom trick for you
5. Save the trick to your collection

### Media Management
1. Navigate to the Gallery page
2. Upload images or videos
3. Organize your media collection
4. View and manage your files

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL scripts
3. Enable authentication providers
4. Set up storage buckets
5. Configure RLS policies

### Claude AI Setup
1. Get API key from Anthropic Console
2. Add to environment variables
3. Configure model preferences (currently using Claude 3 Haiku)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthPage.tsx    # Authentication page
│   ├── GalleryPage.tsx # Media gallery
│   ├── MagicTricksPage.tsx # Main tricks page
│   ├── ProfilePage.tsx # User profile management
│   └── ...             # Other UI components
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utility libraries
│   ├── claude.ts      # Claude AI integration
│   ├── storage.ts     # Local storage utilities
│   ├── supabase.ts    # Supabase configuration
│   └── supabaseStorage.ts # File storage utilities
└── ...                # Other source files
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** - For the amazing Claude AI API
- **Supabase** - For the excellent backend-as-a-service platform
- **Vite** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **React** - For the amazing frontend library

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/AkhilKumar-Git/magic-tricks--app/issues) page
2. Create a new issue with detailed description
3. Contact the maintainers

## 🎉 Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ and a touch of magic ✨**

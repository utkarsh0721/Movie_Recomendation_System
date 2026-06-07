# 🎬 CineAI - AI-Powered Movie Recommendation System

<div align="center">

![CineAI Banner](https://img.shields.io/badge/CineAI-Movie%20Recommendations-blueviolet?style=for-the-badge)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Discover your next favorite movie with AI-powered recommendations!**

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [API Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**CineAI** is a modern, full-stack movie and web series recommendation platform powered by Google's Gemini AI. It provides personalized movie suggestions based on user preferences, viewing history, and advanced AI-powered content analysis.

### 🎯 Key Highlights

- 🤖 **AI-Powered Recommendations** using Google Gemini API
- 🎨 **Modern UI** with dark mode and smooth animations
- 🔍 **Advanced Filtering** by genre, mood, country, year, and more
- ⭐ **Personal Collections** - Favorites and Watchlist
- 📊 **Smart Sorting** - AI-based watchlist organization
- 🎭 **Multi-Content Support** - Movies, Series, Anime, K-dramas
- 📱 **Fully Responsive** design for all devices
- 🔐 **Secure Authentication** with JWT tokens

---

## ✨ Features

### 🎥 For Users

#### 🏠 **Home Page**
- Trending movies carousel
- Top-rated content
- Recently added movies
- Personalized AI recommendations (for logged-in users)
- AI-generated content suggestions

#### 🔍 **Explore & Discovery**
- Advanced search with debouncing
- Multi-select filters:
  - **Genres**: Action, Thriller, Romance, Comedy, Drama, Horror, Sci-Fi, Mystery, Fantasy, Adventure, Animation
  - **Moods**: Fast-paced, Slow-paced, Emotional, Lighthearted, Dark, Feel-good, Suspenseful, Intense
  - **Content Types**: Movie, Web Series, Anime, K-drama, Documentary
  - **Age Ratings**: All Ages, 13+, 15+, 18+
  - **Countries**: India, USA, Korea, Japan, UK, and more
  - **Release Year Range**
  - **Minimum Rating**
  - **Pace**: Fast, Medium, Slow
- Sort by popularity, rating, year, or recently added
- Pagination with smooth navigation

#### 🎬 **Movie Details**
- Full movie information with backdrop
- Embedded trailer player
- Rating and reviews
- Genre and mood tags
- Similar movie recommendations
- Add to favorites/watchlist
- Director and cast information

#### ⭐ **Personal Features**
- **Favorites Collection**: Save and manage favorite movies
- **Watchlist**: Queue movies to watch later
- **AI Smart Sort**: Automatically organize watchlist by rating, popularity, and trending status
- **Personalized Dashboard**: Get recommendations based on your taste

### 🤖 AI Features (Powered by Gemini)

#### 🏷️ **Auto-Tagging System**
When admins add movies, AI automatically generates:
- Genre classifications
- Mood detection
- Age rating suggestions
- Pace analysis
- Relevant tags
- Content analysis

#### 💡 **Smart Recommendations**
- Analyzes user preferences and viewing history
- Suggests movies based on favorite genres and moods
- Provides natural language explanations for recommendations
- Adapts to user behavior over time

#### 🎯 **Watchlist Intelligence**
- AI-powered watchlist sorting
- Considers multiple factors:
  - Movie ratings
  - Trending status
  - Popularity metrics
  - User preferences
  - Recently added items

### 🔐 **Authentication & Security**
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- Session management
- Auto-logout on token expiration

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite) | Build Tool |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?logo=tailwind-css) | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-6.21.0-CA4245?logo=react-router) | Routing |
| ![Axios](https://img.shields.io/badge/Axios-1.6.2-5A29E4?logo=axios) | HTTP Client |
| ![Lucide React](https://img.shields.io/badge/Lucide-0.294.0-F56565) | Icons |
| ![React Hot Toast](https://img.shields.io/badge/Toast-2.4.1-FF6B6B) | Notifications |

### **Backend**
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js) | Runtime |
| ![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express) | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb) | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-8.0.3-880000) | ODM |
| ![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?logo=json-web-tokens) | Authentication |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-2.4.3-338833) | Password Hashing |

### **AI & Services**
| Technology | Purpose |
|------------|---------|
| ![Gemini](https://img.shields.io/badge/Gemini_AI-0.2.1-8E75B2?logo=google) | AI Engine |
| ![Google AI](https://img.shields.io/badge/Google_AI-Latest-4285F4?logo=google) | AI Platform |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - Components    │    │ - Controllers   │    │ - Users         │
│ - Pages         │    │ - Routes        │    │ - Movies        │
│ - Hooks         │    │ - Services      │    │ - Collections   │
│ - Context       │    │ - Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   AI Service    │
                    │   (Gemini API)  │
                    └─────────────────┘
```

### Data Flow

1. **User Request** → Frontend → API Routes → Controllers
2. **AI Processing** → AI Service → Gemini API → Response
3. **Data Storage** → Controllers → Models → MongoDB
4. **Response** → Controllers → API Routes → Frontend

---

## 📁 Project Structure


```
Movie_Recomendation_System/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── movieController.js    # Movie CRUD operations
│   │   ├── userController.js     # User operations
│   │   └── aiController.js       # AI features
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Movie.js              # Movie schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── movieRoutes.js        # Movie endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── services/
│   │   ├── aiService.js          # Gemini AI integration
│   │   └── recommendationService.js  # Recommendation logic
│   ├── server.js                 # Express server setup
│   ├── seedData.js              # Database seeder
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── RecommendationCarousel.jsx
│   │   │   ├── MovieGrid.jsx
│   │   │   ├── TrailerModal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── AISuggestions.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── MovieDetail.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Watchlist.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── hooks/
│   │   │   ├── useMovies.js
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   └── useLocalStorage.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api/
│   │   │   └── index.js          # API configuration
│   │   ├── utils/
│   │   │   ├── constants.js      # App constants
│   │   │   └── helpers.js        # Helper functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie_recommendation
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_very_random_and_long
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Usage

### Starting the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📚 API Documentation

API endpoints and documentation will be available at `/api/docs` when the server is running.

---

## 📸 Screenshots

*Screenshots will be added here*

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 🔧 Troubleshooting

### Common Issues

- **MongoDB Connection Error**: Ensure MongoDB is running on port 27017
- **API Key Error**: Verify your Gemini API key is valid
- **Port Already in Use**: Change PORT in .env file

---

## 🚀 Deployment

*Deployment instructions will be added here*

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
---
## 📞 Contact

**Utkarsh Sharma**
- GitHub: [@utkarsh0721](https://github.com/utkarsh0721)
- Email:  utkarshsharma0721@gmail.com

---



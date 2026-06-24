# 🎵 Resonance Music Album Platform

A full-stack music streaming and album management platform built with React, Node.js, Express, MongoDB, and Tailwind CSS. Users can browse albums, discover tracks, and enjoy a modern music experience through a responsive and intuitive interface.

## ✨ Features

* User authentication with JWT
* Secure password hashing using bcrypt
* Album management
* Music track management
* Audio file uploads
* Album artwork uploads
* Responsive user interface
* MongoDB database integration
* RESTful API architecture
* Environment variable configuration
* Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* Lucide React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cookie Parser
* CORS

### Database

* MongoDB Atlas / Local MongoDB

## 📁 Project Structure


```text id="xg9ywk"
music-album/
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── db/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── App.tsx
│   └── index.css
│
├── public/
├── package.json
└── README.md
```

## 🚀 Installation

### Clone Repository

```bash
git clone <repository-url>
cd music-album
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd server
npm install
```

## ⚙️ Environment Variables

Create a `.env` file inside the server directory.

```env

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

## ▶️ Run Development Server

### Frontend

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

### Backend

```bash
cd server
node server.js || npx nodemon server.js
```

Backend runs at:

```text
http://localhost:3000
```

## 📦 API Features

### Authentication

* User Registration
* User Login
* User Logout
* JWT Protected Routes

### Albums

* Create Album
* Update Album
* Delete Album
* Fetch Albums
* View Album Details

### Tracks

* Upload Music Tracks
* Fetch Tracks
* Delete Tracks
* Stream Audio Files

## 🔒 Security

* Password hashing with bcryptjs
* JWT authentication
* Protected API routes
* Environment variable protection
* CORS configuration

## 🗄️ Database

This project uses **MongoDB** with **Mongoose ODM** for storing:

* User information
* Albums
* Track details
* Metadata
* Authentication records

MongoDB Atlas is recommended for production deployments.

## 📸 Media Storage

Media assets such as album covers and music files can be managed through ImageKit integration.

## 🌟 Future Enhancements

* Playlist creation
* Favorites and likes
* Artist profiles
* Search functionality
* Music recommendations
* Admin dashboard
* Recently played history
* Real-time music streaming analytics

## 👨‍💻 Author

Developed as a full-stack music streaming and album management platform using React, Express, MongoDB, and Tailwind CSS.



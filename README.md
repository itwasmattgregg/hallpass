# HallPass

A real-time hall pass management system for teachers built with Vue.js and Firebase. Track which students are currently out of class, monitor how long they've been gone, and manage student check-ins and check-outs with ease.

## What It Does

HallPass helps teachers manage student hall passes digitally. Instead of using paper passes, teachers can:

- **Check out students** - Record when a student leaves class with a predefined reason
- **Track active passes** - See all students currently out of class in real-time
- **Live timer** - Monitor how long each student has been out (updates every second)
- **Check in students** - Mark students as returned when they come back
- **View student details** - Access individual student pass information
- **Predefined reasons** - Use a list of common reasons stored in Firebase

## Features

- Real-time updates using Firebase Firestore
- Live countdown timer showing how long students have been out
- Simple, intuitive interface
- Responsive design
- Automatic sorting by checkout time

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 9.0.0 or higher)
- A **Firebase account** and project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hallpass
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

The app requires Firebase Firestore to be set up. You'll need to:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Update the Firebase configuration in `.env` with your project's credentials. Copy `.env.example` to `.env`

### 4. Firebase Firestore Collections

The app expects the following Firestore collections:

- **`passes`** - Stores hall pass records with fields:
  - `name` (string) - Student name
  - `reason` (string) - Reason for leaving
  - `class` (string) - Class/teacher name
  - `inHall` (boolean) - Whether student is currently out
  - `timeOut` (number) - Timestamp when student left
  - `timeIn` (number) - Timestamp when student returned
  - `slug` (string) - Unique identifier for routing

- **`reasons`** - Stores predefined reasons for leaving:
  - `name` (string) - Reason name (e.g., "Bathroom", "Nurse", "Office")

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080` with hot-reload enabled.

## Available Scripts

```bash
# Start development server with hot reload
npm run dev
# or
npm start

# Lint code
npm run lint

# Build for production
npm run build
```

## Project Structure

```
hallpass/
├── build/              # Webpack configuration files
├── config/             # Environment configuration
├── src/
│   ├── components/     # Vue components
│   │   ├── Home.vue           # Main dashboard showing active passes
│   │   ├── NewContact.vue     # Form to check out a student
│   │   ├── ViewContact.vue    # Individual student detail view
│   │   ├── FullList.vue       # Full list view (to be implemented)
│   │   ├── firebaseInit.js    # Firebase initialization
│   │   └── firebaseConfig.js  # Firebase configuration
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── static/             # Static assets
└── package.json        # Project dependencies
```

## Technology Stack

- **Vue.js 2.7** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Firebase Firestore** - Real-time database
- **Webpack** - Module bundler
- **vue-select** - Select dropdown component

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions
- Not IE (dead browsers)

## License

Private project

## Author

Matt Gregg <mattdgregg@gmail.com>

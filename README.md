# Recycling Management System

A full-stack application for managing recyclable waste with TypeScript, React, and Node.js.

## Features

- **User Authentication**: Secure login and registration
- **Add Waste Entries**: Log recyclable waste with type and weight
- **View Available Waste**: See inventory of all waste materials
- **Track History**: View personal waste submission history
- **Print Reports**: Generate and print waste history reports

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Axios
- **Backend**: Node.js + Express + TypeScript + SQLite3
- **Database**: SQLite
- **Styling**: CSS3

## Project Structure

```
├── frontend/                    # React TypeScript application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── styles/             # CSS files
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   └── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   └── server.ts           # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── .github/copilot-instructions.md
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Add Waste**: Select the waste type and enter the weight in kilograms
3. **View Inventory**: See the total weight and count of each waste type
4. **View History**: Check your personal waste submission history
5. **Print Report**: Generate a printable report of your waste submissions

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Waste Management
- `POST /waste/add` - Add a new waste entry
- `GET /waste/inventory` - Get total waste inventory
- `GET /waste/history/:userId` - Get user's waste history

## Development

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## License

MIT

## Support

For issues or questions, please open an issue on the project repository.

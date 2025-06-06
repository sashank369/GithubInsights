# GitHub Repository Insights

A web application that provides insights and analytics for any public GitHub repository.

## Features

- View repository metadata (stars, forks, issues, etc.)
- Analyze commit activity and trends
- View top contributors and their contributions
- Responsive design that works on all devices

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Django REST Framework
- **Database**: MySQL
- **Charts**: Chart.js

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL 5.7+
- Git

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a MySQL database named `github_insights` (or any other name you prefer).

5. Create a `.env` file in the `backend` directory with your database credentials:
   ```
   DB_NAME=github_insights
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=3306
   GITHUB_TOKEN=your_github_token  # Optional but recommended for higher rate limits
   ```

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application should now be running at `http://localhost:3000`

## Usage

1. Open the application in your web browser
2. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. Click "Analyze Repository" to view insights

## API Endpoints

- `POST /api/analyze/` - Analyze a GitHub repository
  - Request body: `{ "repo_url": "https://github.com/username/repo" }`

## Environment Variables

### Backend

- `DB_NAME` - MySQL database name
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `GITHUB_TOKEN` - GitHub personal access token (optional but recommended)

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

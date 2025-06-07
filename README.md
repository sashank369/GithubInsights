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
- **Database**: SQLite (built-in with Django)
- **Charts**: Chart.js

## Prerequisites

- Python 3.8+
- Node.js 14+
- Git
- Docker (optional, for containerized deployment)

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

4. Create a `.env` file in the `backend` directory with your GitHub token (optional but recommended for higher rate limits):
   ```
   GITHUB_TOKEN=your_github_token
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
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Usage

1. Open the application in your web browser
2. Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
3. Click "Analyze Repository" to view insights

## API Endpoints

- `POST /api/analyze/` - Analyze a GitHub repository
  - Request body: `{ "repo_url": "https://github.com/username/repo" }`

## Environment Variables

### Backend

- `GITHUB_TOKEN` - GitHub personal access token (optional but recommended for higher rate limits)

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

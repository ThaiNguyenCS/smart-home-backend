#### Connect to database
* Run `docker compose up -d` to run postgres container. Connect to database via localhost:5435 


## Root Directory
- `package.json`: Project metadata and dependencies.

## Backend
- `.env`: Environment variables.
- `.env.dev`: Development environment variables.
- `.env.template`: Template for environment variables.
- `.gitignore`: Git ignore file.
- `data.js`: Data handling script.
- `docker-compose.yaml`: Docker Compose configuration.
- `evolution.txt`: Project evolution notes.
- `index.ts`: Main entry point for the backend.
- `led.js`: LED control script.
- `mqtt.js`: MQTT handling script.
- `package.json`: Backend-specific metadata and dependencies.
- `README.md`: Backend-specific documentation.
- `scheduler.ts`: Task scheduler script.
- `tsconfig.json`: TypeScript configuration.

### Backend Subdirectories
- `config/`: Configuration files.
- `controller/`: Controllers for handling requests.
- `errors/`: Error handling.
- `logger/`: Logging utilities.
- `middleware/`: Middleware functions.
- `model/`: Data models.
- `repository/`: Data repositories.
- `routes/`: API routes.
- `service/`: Business logic services.
- `temp_design_pattern/`: Temporary design patterns.
- `types/`: TypeScript types.
- `utils/`: Utility functions.
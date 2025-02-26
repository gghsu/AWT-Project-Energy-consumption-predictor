# Use a minimal Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy dependency file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code (including model.pkl)
COPY . .

# Expose port 5000 for the Flask API
EXPOSE 5000

# Run the application
CMD ["python", "server.py"]

CREATE USER IF NOT EXISTS 'backend-service'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON `ingabot-dev`.* TO 'backend-service'@'localhost';
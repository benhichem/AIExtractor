# Extracta AI Account Creator

## Description
This script automates the process of:
1. Generating new email accounts.
2. Creating new accounts on Extracta.ai.
3. Retrieving the API key from Extracta.ai.
4. Storing account details (email, password, API key, creation date, and usage status) in an SQLite database.
5. Using proxy rotation via `proxy2.webshare.io` for anonymity.

## Technologies Used
- **TypeScript**
- **Puppeteer-Extra** (for browser automation)
- **puppeteer-extra-plugin-stealth** (to evade bot detection)
- **proxy2.webshare.io** (for proxy rotation)
- **SQLite** (for data storage)

## Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **npm or yarn** (for package management)

### Install Dependencies
Run the following command:
```sh
npm install 
```
## Configuration
Before running the script, configure the required parameters:

  1. Proxy Setup: Ensure you have a proxy2.webshare.io subscription and configure your proxy details.
  2. Database: The script will automatically create an SQLite database (accounts.db).
### Running the Script
Execute the script with:
```sh
npm start 
```
## Database Structure  

The script stores the following information in an SQLite database:  

| Column      | Type     | Description                   |
|------------|---------|-------------------------------|
| email      | TEXT    | Generated email              |
| password   | TEXT    | Account password             |
| api_key    | TEXT    | Extracta.ai API key         |
| created_at | TEXT    | Account creation timestamp  |
| used       | BOOLEAN | Whether the account has been used |

### Features 
Features
* Automated Email Generation: Creates unique email accounts.
* Stealth Browsing: Uses stealth plugins to bypass bot detection.
* Proxy Rotation: Ensures each request appears to come from a different IP.
* Database Storage: Stores login credentials and API keys securely.

### Disclaimer 
his script is for educational and research purposes only. The user assumes full responsibility for any actions performed using this script.

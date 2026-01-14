# [Express API Project]

## Functionality

- **Authentication** through email and API token encryption using ***deterministic AES***, ***bcrypt*** password hashing and ***sqlite3*** database storage
- **Authorization** through ***JWT as Bearer tokens***
- **Caching** refresh JWTs using **Redis**

## Requests 

### Signup User *(/api/signup)*
**POST:** Returns access and refresh JWTs<br>
**Required parameters:** email, password<br>

### Login User *(/api/login)*
**POST:** Returns access and refresh JWTs<br>
**Required parameters:** email, password, API token (optional)<br>

### Get/Generate API token *(/api/apitk)*
**GET:** Returns API token<br>
**Required headers:** authorization(Bearer \<access_token>)<br>
**PATCH:** Regenerate API token<br>
**Required headers:** authorization(Bearer \<access_token>)<br>

### Rotate Refresh JWT *(/api/refresh-tk)*
**POST:** Returns refresh and access JWT<br>
**Required parameters:** token(refresh JWT)<br>

### Logout User *(/api/logout)*
**DELETE:** Logs out the user <br>
**Required parameters:** token(refresh JWT)<br>

### Delete Account *(/api/account)*
**DELETE:** Deletes user's account <br>
**Required parameters:** token(refresh JWT)<br>

## How to run
### Docker
Development start: `docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml up --build`<br>
Development stop: `docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml down -v`<br>
Production start: `docker-compose -f docker-compose.yaml -f docker-compose-prod.yaml up --build`<br>
Production stop: `docker-compose -f docker-compose.yaml -f docker-compose-prod.yaml down`

### npm
Development: `npm run dev`
Production: `npm start`

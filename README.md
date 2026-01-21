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
**POST:** Returns access and refresh JWTs, API token (optional) <br>
**Required parameters:** email, password<br>

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
**Windows prerequisites:** Make sure you have a way to run bash scripts (WSL / git bash / etc.)
**Docker prerequisites:** Make sure you have docker installed
**Start:** `./run.bash {dev|prod}`
**Stop:** `./exit.bash` 

# [Express.js Server]

## Functionality

- **Authentication** through hashing pw using bcrypt, email using deterministic AES encryption and storing them inside sqlite3 database
- **Authorization** through JWT as Bearer tokens
- Emit, verify, store encrypted **API tokens**

## Requests 

### Login/Signup User *(/api/auth)*
**POST:** Logs/Signs-up the user. Returns access token<br>
**Required parameters:** email, password, mode("login"/"signup")<br>

### Get/Generate API token *(/api/apitoken)*
**GET:** Returns API token<br>
**Required headers:** authorization(Bearer \<access_token>)<br>
**PATCH:** Generate/Regenerate API token, returns status code<br>
**Required headers:** authorization(Bearer \<access_token>)<br>



## Thought process
- Client sends request (/api/auth) for authentication
    - Fetch possible user account
        - Check mode
            - Signup
                - User already exists
                    <br>? Return status 409
                    <br>:
                        <br>- Hash pw and email
                        <br>- New database entry
                        <br>- Send status 201
            - Login
                - User doesn't exist
                    <br>? Return status 404
                    <br>:
                        <br>- Compare creds hashes. Return 401 if not valid
                        <br>- Send access token if exists
                        <br>- Send status 200
            - Send JWT

- User logged in
    - Sends request to generate API token (Client warned user if exists)
        - Access JWT expired
        <br>?
            <br>- Logout
            <br>- Rotate refresh token
        <br>: Generate and send new API token

    - Sends request to get posts
        - Verify JWT
        - Return posts

    - Sends request to logout (?)
        - Invalidate access token (?)
        - Rotate refresh token (?)

    - Sends request to delete account (?)
        - Prompt again to enter creds
        - Warning
        - Delete account from database
        - Invalidate access and refresh token (?)
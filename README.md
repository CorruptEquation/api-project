[Express.js Server]

#### Requests:

#### Functionality:
- Authentication System: Hashing pw using bcrypt, email using deterministic AES encryption and storing inside sqlite3 database
- Autorization through JWT as Bearer tokens



### Thought process
- Client sends request (/api/auth) for authentication
    - Fetch possible user account
        - Check mode
            - Signup
                - User already exists
                    ? Return status 409
                    :
                        - Hash pw and email
                        - New database entry
                        - Send status 201
            - Login
                - User doesn't exist
                    ? Return status 404
                    :
                        - Compare creds hashes. Return 401 if not valid.
                        - Send access token if exists
                        - Send status 200
            - Send JWT

- User logged in
    - Sends request to generate API token (Client warned user if exists)
        - Access JWT expired
        ?
            - Logout
            - Rotate refresh token
        : Generate and send new API token

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
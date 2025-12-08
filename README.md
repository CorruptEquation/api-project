[Express.js Server]

#### Requests:

#### Functionality:
- Authentication System:
    - Authentication through bcrypt comparing hashes
    - Hashing account creds using bcrypt and storing inside sqlite3 database
    - Autorization through JWT



### Thought process
- User sends request (/api/auth) for authentication

    - Manage bad requests (format validity, missing fields, etc.)
    Request body needs to contain:
        - email
        - password
        - mode (signup or login)

    - Fetch possible user account
        - Check mode
            - Signup
                - User already exists
                    ? return status 409
                    :
                        - Hash pw and email
                        - New database entry
                        - Set status 201
            - Login
                - User doesn't exist
                    ? return status 404
                    :
                        - Compare creds hashes. Return 401 if not valid.
                        - Set status 200
    
    - Generate and send access token through httpOnly cookie

- User logged in
    - Sends request (/api/) to generate API token
        - Verify if access JWT hasn't expired, else:
            - Logout
            - Rotate refresh token
        - Generate and send new API token

    - Sends request to logout
        - Clear cookie
        - Invalidate access token (?)
        - Rotate refresh token

    - Sends request to delete account
        - Prompt again to enter creds
        - Warning
        - Delete account from database
        - Invalidate access and refresh token (?)
        - Clear cookie
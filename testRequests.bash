#!/bin/bash

successfulTests=0
tests=9
randEmail=$(tr -dc 'a-z0-9' </dev/urandom | head -c 13; echo)
randEmail+="@gmail.com"
randPassword=$(tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 13; echo)
echo $randEmail
echo $randPassword

echo -e "\n\n"

parseResponse() {
	body=""
	response=$(echo "$1" | jq -r '.Response')
	APIToken=$(echo "$1" | jq -r '.APIToken')
	if [ ! "$response" = "null" ]; then
	  body+="$response"
	elif [ ! "$APIToken" = "null" ]; then
	  body+="$APIToken"
	fi

	accessTk=$(echo "$1" | jq -r '.accessToken')
	refreshTk=$(echo "$1" | jq -r '.refreshToken')
	if [ "$accessTk" -a ! "$accessTk" = "null" ] && [ "$refreshTk" -a ! "$refreshTk" = "null" ]; then
	  body+="|$accessTk|$refreshTk"
	fi

	APIToken=$(echo "$1" | jq -r '.APIToken')
	if [ ! "$APIToken" = "null" ]; then
	  body+="|$APIToken"
	fi

	echo "$body"
}

verifyTk() {
#	  echo "$("./node_modules/.bin/tsx" -e " \
#		import { decryptDeterministic } from './src/utils/aesMethods';
#		import { verify$1Tk } from './src/utils/jwtMethods';
#		const payload = verify$1Tk('$2');
#		console.log(decryptDeterministic(payload.encryptedEmail, 'email'));
#		") =================== $3"

	if [ "$("./node_modules/.bin/tsx" -e " \
		import { decryptDeterministic } from './src/utils/aesMethods';
		import { verify$1Tk } from './src/utils/jwtMethods';
		const payload = verify$1Tk('$2');
		console.log(decryptDeterministic(payload.encryptedEmail, 'email'))")" == "$3" ]; then echo "OK"; else echo "NO"; fi
}

signupRefreshTk=null
signup() {
	echo "Signup Test:"

	# Send request
	response=$(curlie -s POST localhost:3000/api/signup \
    	Accept:"application/json" \
    	email="$1" password="$2")
	
	# Assign vars
	IFS='|' read response accessTk refreshTk <<< $(parseResponse "$response")
	
	# Output response
	echo "Response: $response"
	echo "Access token: $accessTk"
	echo "Refresh token: $refreshTk"
	if [ $accessTk ] && [ refreshTk ]; then
	  signupRefreshTk=$refreshTk
	fi

	# Verify accessTk
	if [ "$accessTk" ] && [ "$(verifyTk "Access" "$accessTk" "$1")" != "OK" ]; then echo "accessTk mismatch"; return 1; fi

	# Verify refreshTk
	if [ "$refreshTk" ] && [ "$(verifyTk "Refresh" "$refreshTk" "$1")" != "OK" ]; then echo "refreshTk mismatch"; return 1; fi
  
	echo ""
	((successfulTests++))
  }; signup "$randEmail" "$randPassword"

echo "Duplicate Signup Test:"
signup "$randEmail" "$randPassword"

loginAccessTk=null
loginRefreshTk=null
login() {
	echo "Login Test:"

	# Send request
	response=$(curlie -s POST localhost:3000/api/login \
    	Accept:"application/json" \
    	email="$1" password="$2")
	
	# Assign vars
	IFS='|' read response accessTk refreshTk <<< $(parseResponse "$response")

	# Output response
	echo "Response: $response"
	echo "Access token: $accessTk"
	loginAccessTk="$accessTk"
	echo "Refresh token: $refreshTk"
	loginRefreshTk="$refreshTk"

	# Verify accessTk
	if [ "$accessTk" ] && [ "$(verifyTk "Access" "$accessTk" "$1")" != "OK" ]; then echo "accessTk mismatch"; return 1; fi

	# Verify refreshTk
	if [ "$refreshTk" ] && [ "$(verifyTk "Refresh" "$refreshTk" "$1")" != "OK" ]; then echo "refreshTk mismatch"; return 1; fi

	echo ""
	((successfulTests++))
}; login "$randEmail" "$randPassword"

getAPITk() {
	echo "Get API Token Test:"

	# Send request
	response=$(curlie -s GET localhost:3000/api/apitk \
    	Authorization:"Bearer $1")
	
	# Assign vars
	IFS='|' read response <<< $(parseResponse "$response")

	# Output response
	echo "Response/API token: $response"

	echo ""
	((successfulTests++))
}; getAPITk "$loginAccessTk"

genAPITk() {
	echo "Generate API Token Test:"

	# Send request
	response=$(curlie -s PATCH localhost:3000/api/apitk \
    	Authorization:"Bearer $1")
	
	# Assign vars
	IFS='|' read response <<< $(parseResponse "$response")

	# Output response
	echo "Response: $response"

	echo ""
	((successfulTests++))
}; genAPITk "$loginAccessTk"

echo "Get Generated API Token:"
getAPITk "$loginAccessTk"

rotateRefreshTk() {
	echo "Rotate Refresh Token Test:"

	# Send request
	response=$(curlie -s POST localhost:3000/api/refresh-tk \
    	Accept:"application/json" \
    	token="$2")
	
	# Assign vars
	IFS='|' read response accessTk refreshTk <<< $(parseResponse "$response")
	
	# Output response
	echo "Response: $response"
	echo "Access token: $accessTk"
	loginAccessTk="$accessTk"
	echo "Refresh token: $refreshTk"
	loginRefreshTk="$refreshTk"

	# Verify accessTk
	if [ "$accessTk" ] && [ "$(verifyTk "Access" "$accessTk" "$1")" != "OK" ]; then echo "accessTk mismatch"; return 1; fi

	# Verify refreshTk
	if [ "$refreshTk" ] && [ "$(verifyTk "Refresh" "$refreshTk" "$1")" != "OK" ]; then echo "refreshTk mismatch"; return 1; fi

	echo ""
	((successfulTests++))
}; rotateRefreshTk "$randEmail" "$loginRefreshTk"

lgout() {
	echo "Logout Test:"

	# Send request
	response=$(curlie -s DELETE localhost:3000/api/logout \
    	Accept:"application/json" \
    	token="$1")
	
	# Assign vars
	IFS='|' read response <<< $(parseResponse "$response")
	
	# Output response
	echo "Response: $response"

	echo ""
	((successfulTests++))
}; lgout "$loginRefreshTk"

delAcc() {
	echo "Delete Account Test:"

	# Send request
	response=$(curlie -s DELETE localhost:3000/api/account \
    	Accept:"application/json" \
    	token="$1")
	
	# Assign vars
	IFS='|' read response <<< $(parseResponse "$response")
	
	# Output response
	echo "Response: $response"

	echo ""
	((successfulTests++))
}; delAcc "$signupRefreshTk"

echo "Passed tests: $successfulTests/$tests"

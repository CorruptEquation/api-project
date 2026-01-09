parseResponse() {
	response=$(echo "$1" | jq -r '.Response')
	accessTk=$(echo "$1" | jq -r '.accessToken')
	refreshTk=$(echo "$1" | jq -r '.refreshToken') 
	echo "$response|$accessTk|$refreshTk"
}

verifyTk() {
	if [ "$(node --input-type=module -e " \
		import { decryptDeterministic } from './utils/aesMethods.mjs';
		import { verify$1Tk } from './utils/jwtMethods.mjs';
		console.log(decryptDeterministic(verify$1Tk('$2'), 'email'))")" == "$3" ]; then echo "OK"; else echo "NO"; fi
}

# Signup Test
signup() {
	# Send request
	response=$(curlie -s POST localhost:3000/api/signup \
    	Accept:"application/json" \
    	email="$1" password="$2")
	
	# Assign vars
	IFS='|' read response accessTk refreshTk <<< $(parseResponse "$response")

	# Output response
	echo "signup: $response"

	# Verify accessTk
	if [ "$accessTk" != 'null' ] && [ "$(verifyTk "Access" "$accessTk" "$1")" != "OK" ]; then echo "signup: accessTk mismatch"; return 1; fi

	# Verify refreshTk
	if [ "$refreshTk" != 'null' ] && [ "$(verifyTk "Refresh" "$refreshTk" "$1")" != "OK" ]; then echo "signup: refreshTk mismatch"; return 1; fi
	
}; signup "$1" "$2"

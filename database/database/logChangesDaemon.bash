# Specify the file to watch
FILE_TO_WATCH="./database.db"

# Specify the script to run on change
SCRIPT_TO_RUN="./dbLogs.js"

# Run the listener
while true; do
    # Wait for the file to change
    inotifywait -e modify "$FILE_TO_WATCH"
    
    # Run the specified script
	clear
	node "$SCRIPT_TO_RUN"
done


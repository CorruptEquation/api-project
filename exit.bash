set -e # Immediately exit if any command fails

if [[ "$1" != "dev" && "$1" != "prod" ]]; then
  echo "Usage: $0 {dev|prod}"
  exit 1
fi

rm -rf database/database.db

ARGS=(
  -f docker-compose.yaml
  -f docker-compose-"$1".yaml
  down
)

if [[ "$1" == "dev" ]]; then
  ARGS+=(-v)
fi

sudo docker-compose "${ARGS[@]}"

set -e # Immediately exit if any command fails

env="$(docker exec api-project-node-app-1 printenv ENV)"

ARGS=(
  -f docker-compose.yaml
  -f docker-compose-"$env".yaml
  down
)

if [[ "$env" == "dev" ]]; then
  ARGS+=(-v)
  rm -rf database/database.db
fi

sudo docker-compose "${ARGS[@]}"

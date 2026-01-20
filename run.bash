set -e # Immediately exit if any command fails

if [[ "$1" != "dev" && "$1" != "prod" ]]; then
  echo "Usage: $0 {dev|prod}"
  exit 1
fi

docker info > /dev/null 2>&1 || {
  #echo "Docker is not running. Enter password to start Docker.";
  sudo systemctl start docker;
}

sudo docker-compose \
  -f docker-compose.yaml \
  -f docker-compose-"$1".yaml \
  up --build

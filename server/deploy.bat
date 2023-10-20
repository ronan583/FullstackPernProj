$VERSION = Read-Host "What should the version be?"

docker build -t ronan583/pernproj:$VERSION .
docker push ronan583/pernproj:$VERSION

ssh root@170.64.200.25 "docker pull ronan583/pernproj:$VERSION dokku git:from-image api ronan583/pernproj:$VERSION"

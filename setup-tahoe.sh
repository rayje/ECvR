#!/bin/sh

if [ $# -eq 0 ]; then
    echo "Usage: ./setup-tahoe.sh <introducer-ip>"
    exit 1
fi

log() {
	echo
	echo "############################################"
	echo $1
	echo "############################################"
}

INTRODUCER=$1
IPS=$(./readInstances | awk '{print $9}' | tail -n+3);

# Create/Start the introducer
log "Creating INTRODUCER"
./tahoe --startInt $INTRODUCER

# Create storage nodes
log "Creating Storage Nodes"
for i in $IPS; do
	./tahoe --create $i
done

# Set comm port to 46395
log "Setting comm port: 46395"
for i in $IPS; do 
	./tahoe --config $i -x 46395; 
done

# Start storage nodes
log "Starting all storage nodes"
./tahoe --startAll $INTRODUCER

log "Waiting for nodes to start (5 secs)"
sleep 10

# Create aliases on all nodes
log "Creating Aliases"
./tahoe --createAliases
echo
./tahoe --status
echo
./tahoe --listAliases
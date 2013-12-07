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

KEY=rayje-os-key.pem
INTRODUCER=$1

# Stop all tahoe storage nodes
log "Killing All Storage Nodes"
./tahoe --killAll

# Stop the tahoe introducer
log "Killing INTRODUCER"
./tahoe --killInt $INTRODUCER

IPS=$(./readInstances | awk '{print $9}' | tail -n+3);

# Delete the .tahoe directory on all instances
log "Deleting .tahoe directories"
for i in $IPS; do 
	ssh -i $KEY ubuntu@$i 'rm -rf .tahoe'; 
done

# Delete the .tahoe-int directory from the introducer
log "Deleting .tahoe-int directory"
ssh -i $KEY ubuntu@$INTRODUCER 'rm -rf .tahoe-int'

# Verify no .tahoe directories exist
for i in $IPS; do 
	ssh -i $KEY ubuntu@$i 'if [ -d ".tahoe" ]; then echo "Tahoe exists"; fi;'; 
done

# Verify no .tahoe-int directories exist
for i in $IPS; do 
	ssh -i $KEY ubuntu@$i 'if [ -d ".tahoe-int" ]; then echo "Tahoe Introducer exists"; fi;'; 
done

echo
./tahoe --status


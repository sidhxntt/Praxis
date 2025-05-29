#!/bin/bash

set -e

# Define color codes
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
MAGENTA="\033[1;35m"
BOLD="\033[1m"
RESET="\033[0m"

echo -e "${CYAN}🧹 Cleaning up Kubernetes resources...${RESET}"

# Delete all resources in the monitoring-stack namespace
echo -e "${YELLOW}Deleting all resources in monitoring-stack namespace...${RESET}"
kubectl delete namespace monitoring-stack --ignore-not-found=true

# Wait for namespace deletion
echo -e "${CYAN}⏳ Waiting for namespace deletion...${RESET}"
kubectl wait --for=delete namespace/monitoring-stack --timeout=60s || true

# Clean up persistent volumes if they exist
echo -e "${YELLOW}Cleaning up persistent volumes...${RESET}"
kubectl delete pv elasticsearch-pv --ignore-not-found=true

echo -e "${BOLD}${GREEN}✅ Cleanup completed!${RESET}"

# Option to stop minikube
read -p "$(echo -e ${MAGENTA}Do you want to stop Minikube? [y/N]: ${RESET})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${CYAN}🛑 Stopping Minikube...${RESET}"
    minikube stop
    echo -e "${GREEN}✅ Minikube stopped${RESET}"
fi
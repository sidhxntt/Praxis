#!/bin/bash

set -e

# Define color codes
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
CYAN="\033[1;36m"
MAGENTA="\033[1;35m"
BOLD="\033[1m"
RESET="\033[0m"

# Check if minikube is running
echo -e "${CYAN}🔍 Checking Minikube status...${RESET}"
if ! minikube status > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Minikube is not running. Starting Minikube...${RESET}"
    minikube start --driver=docker --memory=4096 --cpus=2
    echo -e "${GREEN}✅ Minikube started successfully${RESET}"
else
    echo -e "${GREEN}✅ Minikube is already running${RESET}"
fi

# Enable required addons
echo -e "${CYAN}🔧 Enabling Minikube addons...${RESET}"
minikube addons enable ingress
minikube addons enable storage-provisioner
minikube addons enable default-storageclass

# Check for existing Docker images and load them
echo -e "${CYAN}🏗️  Checking for existing Docker images...${RESET}"
if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "django-app:latest"; then
    echo -e "${GREEN}✅ Docker image found locally. Loading into Minikube...${RESET}"
    minikube image load django-app:latest
    echo -e "${GREEN}✅ Image loaded successfully${RESET}"
else
    echo -e "${YELLOW}⚠️  Docker image not found locally. Please build it first:${RESET}"
    echo -e "${GREEN}docker build -t django-app:latest .${RESET}"
    echo -e "${GREEN}minikube image load django-app:latest${RESET}"
    read -p "$(echo -e "${CYAN}Press ENTER once you've built and loaded your app image...${RESET}")"
fi

# Apply Kubernetes configurations
echo -e "${CYAN}🚀 Deploying services to Kubernetes...${RESET}"
kubectl apply -f k8s-config.yaml

# Wait for deployments to be ready
echo -e "${CYAN}⏳ Waiting for deployments to be ready...${RESET}"
kubectl wait --for=condition=available --timeout=300s deployment/redis -n monitoring-stack
kubectl wait --for=condition=available --timeout=300s deployment/elasticsearch -n monitoring-stack
kubectl wait --for=condition=available --timeout=300s deployment/kibana -n monitoring-stack
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n monitoring-stack
kubectl wait --for=condition=available --timeout=300s deployment/grafana -n monitoring-stack
kubectl wait --for=condition=available --timeout=300s deployment/django-app -n monitoring-stack

# Get service URLs
echo -e "\n${BOLD}${GREEN}✅ All services deployed successfully!${RESET}"
echo -e "\n${BOLD}${CYAN}🌐 Service URLs:${RESET}"

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Get NodePort for each service
KIBANA_PORT=$(kubectl get svc kib01 -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
PROMETHEUS_PORT=$(kubectl get svc prometheus -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
GRAFANA_PORT=$(kubectl get svc grafana -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
APP_PORT=$(kubectl get svc app -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')

echo -e "${MAGENTA}📊 Kibana: ${YELLOW}http://${MINIKUBE_IP}:${KIBANA_PORT}${RESET}"
echo -e "${MAGENTA}📈 Prometheus: ${YELLOW}http://${MINIKUBE_IP}:${PROMETHEUS_PORT}${RESET}"
echo -e "${MAGENTA}📊 Grafana: ${YELLOW}http://${MINIKUBE_IP}:${GRAFANA_PORT}${RESET} (admin/admin)"
echo -e "${MAGENTA}🐍 Django App: ${YELLOW}http://${MINIKUBE_IP}:${APP_PORT}${RESET}"

# Show kubectl commands for monitoring
echo -e "\n${BOLD}${CYAN}🔍 Useful commands:${RESET}"
echo -e "${GREEN}kubectl get pods -n monitoring-stack${RESET} - Check pod status"
echo -e "${GREEN}kubectl logs -f deployment/django-app -n monitoring-stack${RESET} - View app logs"
echo -e "${GREEN}kubectl logs -f deployment/elasticsearch -n monitoring-stack${RESET} - View Elasticsearch logs"
echo -e "${GREEN}kubectl describe pod <pod-name> -n monitoring-stack${RESET} - Debug specific pod"

# Port forwarding option
echo -e "\n${BOLD}${MAGENTA}💡 Alternative: Use port forwarding for local access:${RESET}"
echo -e "${GREEN}kubectl port-forward svc/kib01 5601:5601 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/grafana 3000:3000 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/prometheus 9090:9090 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/app 4000:4000 -n monitoring-stack${RESET}"

# Show dashboard access
echo -e "\n${BOLD}${CYAN}📱 Minikube Dashboard:${RESET}"
echo -e "${GREEN}minikube dashboard${RESET} - Open Kubernetes dashboard"
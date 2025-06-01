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

# Check for praxis-app image
if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "praxis-app:latest"; then
    echo -e "${GREEN}✅ praxis-app image found locally. Loading into Minikube...${RESET}"
    minikube image load praxis-app:latest
    echo -e "${GREEN}✅ praxis-app image loaded successfully${RESET}"
else
    echo -e "${YELLOW}⚠️  praxis-app Docker image not found locally.${RESET}"
    echo -e "${GREEN}Please build it first: docker build -t praxis-app:latest .${RESET}"
    read -p "$(echo -e "${CYAN}Press ENTER once you've built the praxis-app image...${RESET}")"
    minikube image load praxis-app:latest
fi

# Check for praxis-celery image
if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "praxis-celery:latest"; then
    echo -e "${GREEN}✅ praxis-celery image found locally. Loading into Minikube...${RESET}"
    minikube image load praxis-celery:latest
    echo -e "${GREEN}✅ praxis-celery image loaded successfully${RESET}"
else
    echo -e "${YELLOW}⚠️  praxis-celery Docker image not found locally.${RESET}"
    echo -e "${GREEN}Please build it first: docker build -t praxis-celery:latest .${RESET}"
    read -p "$(echo -e "${CYAN}Press ENTER once you've built the praxis-celery image...${RESET}")"
    minikube image load praxis-celery:latest
fi

# Load other required images that might not be available locally
echo -e "${CYAN}📦 Loading additional required images...${RESET}"
REQUIRED_IMAGES=(
    "redis:latest"
    "docker.elastic.co/elasticsearch/elasticsearch:9.0.0"
    "docker.elastic.co/kibana/kibana:9.0.0"
    "docker.elastic.co/beats/filebeat:9.0.0"
    "prom/prometheus:latest"
    "grafana/grafana-oss:latest"
    "nginx:latest"
)

for image in "${REQUIRED_IMAGES[@]}"; do
    if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "${image}"; then
        echo -e "${GREEN}✅ ${image} found locally. Loading into Minikube...${RESET}"
        minikube image load "${image}"
    else
        echo -e "${YELLOW}⚠️  Pulling ${image}...${RESET}"
        docker pull "${image}"
        minikube image load "${image}"
    fi
done

# Apply Kubernetes configurations
echo -e "${CYAN}🚀 Deploying services to Kubernetes...${RESET}"
kubectl apply -f k8s-config.yaml

# Wait for deployments to be ready
echo -e "${CYAN}⏳ Waiting for deployments to be ready...${RESET}"
echo -e "${YELLOW}This may take several minutes for the first deployment...${RESET}"

# Wait for each deployment individually with longer timeout
deployments=("redis" "elasticsearch" "kibana" "filebeat" "prometheus" "grafana" "praxis-app" "praxis-celery" "nginx")

for deployment in "${deployments[@]}"; do
    echo -e "${CYAN}⏳ Waiting for ${deployment} to be ready...${RESET}"
    kubectl wait --for=condition=available --timeout=600s deployment/${deployment} -n monitoring-stack || {
        echo -e "${YELLOW}⚠️  ${deployment} deployment might be taking longer. Checking status...${RESET}"
        kubectl get pods -n monitoring-stack | grep ${deployment}
        kubectl describe deployment ${deployment} -n monitoring-stack
    }
done

# Check pod status
echo -e "${CYAN}📊 Checking pod status...${RESET}"
kubectl get pods -n monitoring-stack

# Get service URLs
echo -e "\n${BOLD}${GREEN}✅ All services deployed successfully!${RESET}"
echo -e "\n${BOLD}${CYAN}🌐 Service URLs:${RESET}"

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Get NodePort for each service
KIBANA_PORT=$(kubectl get svc kib01 -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
PROMETHEUS_PORT=$(kubectl get svc prometheus -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
GRAFANA_PORT=$(kubectl get svc grafana -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
APP_PORT=$(kubectl get svc praxis-app -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')
NGINX_PORT=$(kubectl get svc nginx -n monitoring-stack -o jsonpath='{.spec.ports[0].nodePort}')

echo -e "${MAGENTA}🌐 Nginx (Load Balancer): ${YELLOW}http://${MINIKUBE_IP}:${NGINX_PORT}${RESET}"
echo -e "${MAGENTA}🐍 Praxis App (Direct): ${YELLOW}http://${MINIKUBE_IP}:${APP_PORT}${RESET}"
echo -e "${MAGENTA}📊 Kibana: ${YELLOW}http://${MINIKUBE_IP}:${KIBANA_PORT}${RESET}"
echo -e "${MAGENTA}📈 Prometheus: ${YELLOW}http://${MINIKUBE_IP}:${PROMETHEUS_PORT}${RESET}"
echo -e "${MAGENTA}📊 Grafana: ${YELLOW}http://${MINIKUBE_IP}:${GRAFANA_PORT}${RESET} (admin/admin)"

# Show kubectl commands for monitoring
echo -e "\n${BOLD}${CYAN}🔍 Useful commands:${RESET}"
echo -e "${GREEN}kubectl get pods -n monitoring-stack${RESET} - Check pod status"
echo -e "${GREEN}kubectl logs -f deployment/praxis-app -n monitoring-stack${RESET} - View app logs"
echo -e "${GREEN}kubectl logs -f deployment/praxis-celery -n monitoring-stack${RESET} - View celery logs"
echo -e "${GREEN}kubectl logs -f deployment/elasticsearch -n monitoring-stack${RESET} - View Elasticsearch logs"
echo -e "${GREEN}kubectl logs -f deployment/nginx -n monitoring-stack${RESET} - View Nginx logs"
echo -e "${GREEN}kubectl describe pod <pod-name> -n monitoring-stack${RESET} - Debug specific pod"

# Port forwarding option
echo -e "\n${BOLD}${MAGENTA}💡 Alternative: Use port forwarding for local access:${RESET}"
echo -e "${GREEN}kubectl port-forward svc/nginx 8080:80 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/praxis-app 4000:4000 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/kib01 5601:5601 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/grafana 3000:3000 -n monitoring-stack${RESET}"
echo -e "${GREEN}kubectl port-forward svc/prometheus 9090:9090 -n monitoring-stack${RESET}"

# Show dashboard access
echo -e "\n${BOLD}${CYAN}📱 Minikube Dashboard:${RESET}"
echo -e "${GREEN}minikube dashboard${RESET} - Open Kubernetes dashboard"

# Show logs troubleshooting
echo -e "\n${BOLD}${YELLOW}🔧 Troubleshooting:${RESET}"
echo -e "${GREEN}kubectl get events -n monitoring-stack --sort-by='.lastTimestamp'${RESET} - View recent events"
echo -e "${GREEN}kubectl top pods -n monitoring-stack${RESET} - View resource usage"
echo -e "${GREEN}kubectl get pv,pvc -n monitoring-stack${RESET} - Check storage volumes"
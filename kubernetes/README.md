# Kubernetes Cluster

## Helm Charts

 - ingress-nginx/ingress-nginx
 - bitnami/redis
 - bitnami/postgresql

## To Run

`kubectl create namespace eplace`
`kubectl apply -k .`

### Copy n' Paste

`kubectl -n kubernetes-dashboard create token admin-user`
`kubectl port-forward service/ingress-nginx-controller 8080:80 -n eplace`
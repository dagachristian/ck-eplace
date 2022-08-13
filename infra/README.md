# Kubernetes Cluster

## Helm Charts

 - metrics-server/metrics-server
 - ingress-nginx/ingress-nginx
 - bitnami/redis
 - bitnami/postgresql

## Requirements

 - some kubernetes cluster(ofc)
 - kubectl
 - metrics-server[^1]
 - kubernetes-dashboard*

*Optional
[^1]: https://github.com/kubernetes-sigs/metrics-server/issues/1061

## To Run

  1. `kubectl apply -f environment`
  2. `kubectl apply -f app`

### TODO

 - statefulset
 - aws eks
 - https

### Copy n' Paste

`docker-compose -f docker-compose-build.yml build`\
`kubectl -n kubernetes-dashboard create token admin-user`\
`kubectl port-forward service/ingress-nginx-controller 8080:80 -n eplace`\
`helm template -f [config].yaml -n eplace [package] [repo/package] > [name].yaml`

Environment\
`kubectl create namespace eplace`\
`kubectl create namespace ingress-nginx-controller`\
`helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx-controller`\
`helm install metrics-server metrics-server/metrics-server -f config/metrics-server-config.yaml -n kube-system`


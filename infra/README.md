# Kubernetes Cluster

## Helm Charts

 - ingress-nginx/ingress-nginx
 - bitnami/redis
 - bitnami/postgresql

## Requirements

 - some kubernetes cluster(ofc)
 - kubectl
 - metrics-server[^1]
 - kubernetes-dashboard*

*Optional\
[^1]: https://github.com/kubernetes-sigs/metrics-server/issues/1061

## To Run

`kubectl create namespace eplace`\
`kubectl apply -k .`

### TODO

 - aws eks
 - https

### Copy n' Paste

`docker-compose -f docker-compose-build.yml build`\
`kubectl -n kubernetes-dashboard create token admin-user`\
`kubectl port-forward service/ingress-nginx-controller 8080:80 -n eplace`\
`helm template -f [config].yaml -n eplace [package] [repo/package] > [name].yaml`


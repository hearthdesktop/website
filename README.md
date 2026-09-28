# hearth.umceko.com

The [Hearth](https://github.com/hearthdesktop/hearth) website: one static page in `site/`, served by nginx on the
umceko cluster.

## Deploying

```sh
kubectl --context umceko apply -k . --server-side --field-manager=hearth-website
```

Server-side apply is required: the site ConfigMap is larger than the annotation client-side apply writes. The
ConfigMaps get content-hash names, so any change under `site/` rolls the deployment by itself.

The site answers on the `https-hearth` listener of the shared `front-gw` gateway in `envoy-gateway-system`, and
cert-manager issues its certificate from that listener. The listener was added once with:

```sh
kubectl --context umceko patch gateway front-gw -n envoy-gateway-system --type=json -p '[{"op":"add","path":"/spec/listeners/-","value":{"name":"https-hearth","protocol":"HTTPS","port":443,"hostname":"hearth.umceko.com","allowedRoutes":{"namespaces":{"from":"All"}},"tls":{"mode":"Terminate","certificateRefs":[{"group":"","kind":"Secret","name":"hearth-umceko-com-tls"}]}}}]'
```

## Previewing

```sh
python3 -m http.server --directory site
```

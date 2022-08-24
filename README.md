## Minikube panel

`minikube dashboard --url`

## ERROR PULLING LOCAL IMAGE

[Solved](https://levelup.gitconnected.com/two-easy-ways-to-use-local-docker-images-in-minikube-cd4dcb1a5379)

Subir a minikube la imagen creadad esde docker

```
# General
minikube image load <IMAGE_NAME>
# Example
minikube image load pz/demo
```

Buildear directamente en el registry de minikube

```
# General
minikube image build -t <IMAGE_NAME> .
# Example
minikube image build -t pz/demo .
```

## PORT FORWARDING 

`kubectl port-forward posts 4000:4000`

# Accelist PDP Frontend

## About
> Branch `main` is Accelist PDP Front end will serve as Personal Data Protection Website.

> Branch `public-page/main` is Accelist PDP Front end will serve as Public Page of Personal Data Protection Website.

## Template
We are using the Accelist Next.js starter. The documentation are on the [https://github.com/accelist/nextjs-starter](https://github.com/accelist/nextjs-starter) repository.

## Cloning the Repository
Clone the repository using this following command:
```
https://github.com/accelist/accelist-pdp-fe.git
```

## Build & Run the Application
After you have installed all softwares above, restore the `node_modules` dependencies using this following command:
```
npm ci
```

After all `node_modules` dependencies have been installed, you could run the front-end files compilation using this command:
```
npm run dev
```

## Building and Running Production Build

```sh
npm run build
```

```sh
npx cross-env \
    NODE_ENV='production' \
    NEXTAUTH_URL='https://www.my-website.com' \
    NEXTAUTH_SECRET='e01b7895a403fa7364061b2f01a650fc' \
    BACKEND_API_HOST='https://demo.duendesoftware.com' \
    OIDC_ISSUER='https://demo.duendesoftware.com' \
    OIDC_CLIENT_ID='interactive.public.short' \
    OIDC_SCOPE='openid profile email api offline_access' \
    npm run start
```

> **DO NOT FORGET** to randomize `NEXTAUTH_SECRET` value for Production Environment with https://generate-secret.vercel.app/32 or `openssl rand -base64 32`

To use SSL Certificates, simply use reverse proxy such as [NGINX](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/) or [Traefik](https://doc.traefik.io/traefik/getting-started/install-traefik/).

## Deployment On Premise Server
For deployment on premise server, using web server ***NODE.JS*** using file server.js, Reference: https://medium.com/@greg.farrow1/nextjs-https-for-a-local-dev-server-98bb441eabd7 and the application is registered as windows service using **nssm** `https://nssm.cc/download` How to use : `https://nssm.cc/usage`
Here are the steps to deploy the application:

* copy folder, components, css, pages, function, public, types, dan nodes_modules(if there are changes or added new library) to server
* Go to the application directory
* delete folder `.next`
* Run command `npm run build`
* makesure there is a server.js file
* Run command `npm run start`
* Open windows service -> go to the windows service that already register using NSSM, right click on the service name, click restart

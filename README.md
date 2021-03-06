# Blaise User Management

[![codecov](https://codecov.io/gh/ONSdigital/blaise-user-management/branch/main/graph/badge.svg)](https://codecov.io/gh/ONSdigital/blaise-user-management)
[![CI status](https://github.com/ONSdigital/blaise-user-management/workflows/Test%20coverage%20report/badge.svg)](https://github.com/ONSdigital/blaise-user-management/workflows/Test%20coverage%20report/badge.svg)
<img src="https://img.shields.io/github/release/ONSdigital/blaise-user-management.svg?style=flat-square" alt="Nisra Case Mover release verison">
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/ONSdigital/blaise-user-management.svg)](https://github.com/ONSdigital/blaise-user-management/pulls)
[![Github last commit](https://img.shields.io/github/last-commit/ONSdigital/blaise-user-management.svg)](https://github.com/ONSdigital/blaise-user-management/commits)
[![Github contributors](https://img.shields.io/github/contributors/ONSdigital/blaise-user-management.svg)](https://github.com/ONSdigital/blaise-user-management/graphs/contributors)


Dashboard for managing Blaise users.

This project is a React application which when build is rendered by a Node.js express server.

![Diagram of Blaise User Management sertup](.github/Diagram.png)

### Setup

#### Prerequisites
To run Blaise User Management locally, you'll need to have [Node installed](https://nodejs.org/en/), as well as [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable).
To have the list of instruments load on the page, you'll need to have [Blaise Instrument Checker](https://github.com/ONSdigital/blaise-instrument-checker) running locally
 or you can [port forward from a Kubernetes pod](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) running in a sandbox.  

#### Setup locally steps
Clone the Repo
```shell script
git clone https://github.com/ONSdigital/blaise-user-management.git
```

Create a new .env file and add the following variables.

| Variable                      | Description                                                                     | Var Example                  |
|-------------------------------|---------------------------------------------------------------------------------|------------------------------|
| PORT                          | Optional variable, specify the Port for express server to run on. If not passed in this is set as 5000 by default. <br><br>It's best not to set this as the react project will try and use the variable as well and conflict. By default React project locally runs on port 3000.                                              | 5009                         |
| VM_EXTERNAL_WEB_URL           | External Url used for CATI dashboard and survey links.                          | tel-client-server.uk         |
| VM_INTERNAL_URL               | Internal url of the Blaise VM which is sent to the Instrument checker service.  | tel-web-server.internal.uk   |
| VM_EXTERNAL_CLIENT_URL        | External link to connect to Blaise remotely through Blaise Server Manager.      | tel-web-server.uk            |
| BLAISE_API_URL | Url that Blaise Instrument Checker is running on to send calls to.              | localhost:5003               |


The .env file should be setup as below
```.env
PORT=5001
VM_EXTERNAL_WEB_URL='tel-client-server.uk'
VM_INTERNAL_URL='tel-web-server.internal.uk'
VM_EXTERNAL_CLIENT_URL='tel-web-server.uk'
BLAISE_API_URL='localhost:5003'
```

Install required modules
```shell script
yarn install
```

##### Run commands

The following run commands are available, these are all setup in the `package.json` under `scripts`.

| Command                        | Description                                                                                                                                               |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `yarn start-server`            | Start the express server, Note: For the website to be rendered the React Project will need to be built.                                                   |
| `yarn start-react`             | Starts react project in local development setup with quick reloading on making changes. Note: For instruments to be shown the server needs to be running. |
| `yarn build-react`             | Compiles build project ready to be served by express. The build in outputted to the the `build` directory which express points to with the var `buildFolder` in `server/server.js`.                       |
| `yarn test-react`              | Run tests for React Components.                                                                                                                           |
| `yarn test-react-coverage`     | Run tests for React Components and outputs coverage statistics.                                                                                           |
| `yarn test`                    | Runs all tests for server and React Components.                                                                                                           |
| `yarn test-coverage`           | Runs all tests for server and React Components and outputs coverage statistics.                                                                           |

##### Simple setup for local development

Setup express project to be call Blaise Instrument Checker. By default, will be running on PORT 5000.
```shell script
yarn start-server
```

Next to make sure the React project make requests the express server make sure the proxy option is set to the right port in the 'package.json'  
```.json
"proxy": "http://localhost:5000",
```

Run the React project for local development. By default, this will be running on PORT 3000
```shell script
yarn start-server
```

To test express sever serving the React project, you need to compile the React project, then you can see it running at [http://localhost:5000/](http://localhost:5000/)
```shell script
yarn build-react
```

### Tests
The [Jest testing framework](https://jestjs.io/en/) has been setup in this project, all tests currently reside in the `tests` directory.
This currently only running tests on the health check endpoint, haven't got the hang of mocking Axios yet.
 
To run all tests run
```shell script
yarn test
```

Other test command can be seen in the Run Commands section above.

Deploying to app engine

To deploy the locally edited service to app engine in your environment, you can run trigger the cloudbuild trigger with the following line, changing the environment variables as needed. 
```.shell
gcloud builds submit --substitutions=_PROJECT_ID=ons-blaise-v2-dev-matt-54,_VM_INTERNAL_URL=test,_VM_EXTERNAL_WEB_URL=test,_VM_EXTERNAL_CLIENT_URL=test,_BLAISE_API_URL=/
```

### Dockerfile
You can run this service in a container, the Dockerfile is setup to:
- Update and upgrade the Docker container image.
- Setup Yarn and the required dependencies.
- Run the tests, the build will fail if the tests fail.
- Build the React project for serving by express
- Run Yarn Start on startup

gcloud builds submit --substitutions=_PROJECT_ID=ons-blaise-v2-dev-matt58,_VM_INTERNAL_URL=test,_VM_EXTERNAL_WEB_URL=dev-matt58-web.social-surveys.gcp.onsdigital.uk,_VM_EXTERNAL_CLIENT_URL=test,_BLAISE_API_URL=restapi.europe-west2-a.c.ons-blaise-v2-dev-matt58.internal:90
gcloud builds submit --substitutions=_PROJECT_ID=ons-blaise-v2-dev,_VM_INTERNAL_URL=test,_VM_EXTERNAL_WEB_URL=dev-web.social-surveys.gcp.onsdigital.uk,_VM_EXTERNAL_CLIENT_URL=test,_BLAISE_API_URL=restapi.europe-west2-a.c.ons-blaise-v2-dev.internal:90,_SLACK_CHANNEL=moo,_SLACK_WEBHOOK=moo

# CodePipeline Radiator

Has your CodePipeline builds ever been broken for multiple days because the status of those pipes weren't visible somewhere all the time? 😢

With CodePipeline Radiator you can see the status of all project pipes you wan't to track. Everything at a glance! 🔥👀

## How to configure

1. Create IAM user who has access to fetch status of CodePipeline projects
2. Create `.env` file with `cp .env.example .env`
3. Fill `REACT_APP_ACCESS_KEY_ID` and `REACT_APP_SECRET_ACCESS_KEY` with information of the user that was created in step 1
4. Also fill `REACT_APP_REGION` with the desired region and `REACT_APP_CODE_PIPELINE_NAMES` with names of CodePipelines you wan't to watch separated with commas (see example below)

Example `.env` file

```bash
REACT_APP_ACCESS_KEY_ID=someRandomStringHereGeneratedByAWS
REACT_APP_SECRET_ACCESS_KEY=someRandomStringHereGeneratedByAWS
REACT_APP_REGION=eu-west-1
REACT_APP_CODE_PIPELINE_NAMES=my-codepipeline-project,some-other-codepipeline-project
```

## Starting the radiator

1. Run `npm run build` to create production build of the radiator
2. Open `index.html` file in `build` folder that was generated in step 1
3. Now you have radiator open 📺!

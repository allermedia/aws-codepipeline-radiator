# CodePipeline Radiator

Has your CodePipeline builds ever been broken for multiple days because the status of those pipes weren't visible somewhere all the time? 😢

With CodePipeline Radiator you can see the status of all project pipes you wan't to track. Everything at a glance! 🔥👀

## How to configure

__Note!__ Configration is subject to change as the radiator is currently being switched to Lambda, which in turn uses IAM roles

1. Create IAM user who has access to fetch status of CodePipeline projects
2. Create `.env` file with `cp .env.example .env`
3. Set the `AWS_REGION` with the desired region in `.env` file or environment variable
4. Auth either using `aws-cli` or set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env` file or environment variable with the information of the user that was created in step 1

Example `.env` file

```bash
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=someRandomStringHereGeneratedByAWS
AWS_SECRET_ACCESS_KEY=someRandomStringHereGeneratedByAWS
```

## Starting the radiator

1. Run `npm run build` to create production build of the radiator
2. Run `npm start` to start the server
3. Open `http://localhost` and set the CodePipeline name to the `q` url param (fe. `?q=my-fantastic-codepipeline`)
4. Enjoy your new visibility to AWS CodePipeline 📺!

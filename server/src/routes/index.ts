import { Router } from "express";
import { CodePipeline } from "aws-sdk";

const codepipeline = new CodePipeline();
const router = Router();

const getPipelineState = (name: string) => codepipeline.getPipelineState({ name }).promise();

router.get('/api/codepipelines/state', (req, res) => {
  const codePipelineNames = req.query.q.split(',');
  Promise.all(codePipelineNames.map(getPipelineState))
    .then(data => res.json(data))
    .catch(err => {
      console.log('Error:', err);
      res.status(500);
    });
});

export default router;
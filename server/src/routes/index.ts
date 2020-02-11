import { Router } from "express";
import { CodePipeline } from "aws-sdk";

const codepipeline = new CodePipeline({
  region: process.env.AWS_DEFAULT_REGION,
});
const router = Router();

router.get('/codepipelines/state', (req, res) => {
  codepipeline.getPipelineState({ name: req.query.q }).promise()
    .then(data => res.json(data))
    .catch(err => {
      console.log('Error:', err);
      res.status(500).json({})
    });
});

export default router;
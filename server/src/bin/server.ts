import app from '..';

app.listen(process.env.HTTP_PORT, () => {
  console.log('');
  console.log(`Express listening on port ${process.env.HTTP_PORT}`);
});

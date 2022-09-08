export default function handler(_, res) {
  const returnTo = encodeURI('http://localhost:3000/');

  res.redirect(
    `${process.env.AUTH0_URI}/v2/logout?federated&returnTo=${returnTo}`
  );
}

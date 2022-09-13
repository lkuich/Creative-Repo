export default function handler(_, res) {
  const returnTo = encodeURI(process.env.NEXT_PUBLIC_LOGOUT_URI);

  res.redirect(
    `${process.env.NEXT_PUBLIC_AUTH0_URI}/v2/logout?federated&returnTo=${returnTo}`
  );
}

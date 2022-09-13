function hasAdminOverride(headers) {
  return (
    process.env.HASURA_GRAPHQL_ADMIN_SECRET &&
    (headers["x-hasura-admin-secret"] ===
      process.env.HASURA_GRAPHQL_ADMIN_SECRET ||
      headers["hasura-admin-secret"] ===
        process.env.HASURA_GRAPHQL_ADMIN_SECRET)
  );
}

function getAuthToken(headers) {
  const hasBearer = headers.authorization.startsWith("Bearer ");
  const authorization = hasBearer
    ? headers.authorization.split("Bearer ")[1]
    : headers.authorization;

  return authorization;
}

module.exports = {
  hasAdminOverride,
  getAuthToken,
};

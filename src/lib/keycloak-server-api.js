const KEYCLOAK_DOMAIN = 'http://localhost:8180';
const KEYCLOAK_REALM = 'runnersutilapp';

/**
 * Retrieves a list of user IDs for enabled users from the Keycloak realm.
 *
 * @param {string} token - The access token for authentication.
 * @return {Promise<Array<string>>} A Promise that resolves to an array of user IDs.
 * @throws {Error} If the request to fetch user data is not successful or encounters an error.
 */
export async function getAllUserIds(token) {
  const response = await fetch(`${KEYCLOAK_DOMAIN}/admin/realms/${KEYCLOAK_REALM}/users?enabled=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Could not fetch user IDs.');
  }

  const users = await response.json();
  const userIds = users.map(user => user.id);

  return userIds;
}
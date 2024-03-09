const RUNNERS_UTIL_RESOURCE_DOMAIN = 'http://localhost:8080';

export async function getAllRuns(token) {
  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/api/admin/test-runs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch runs.');
  }

  const transformedRuns = [];

  for (const key in data) {
    const runObj = {
      id: key,
      ...data[key],
    };

    transformedRuns.push(runObj);
  }

  return transformedRuns;
}

export async function getRunById(runId) {
  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/runs/${runId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch run.');
  }

  const loadedRun = {
    id: runId,
    ...data,
  };

  return loadedRun;
}

export async function createRun(runData) {
  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/runs`, {
    method: 'POST',
    body: JSON.stringify(runData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not create run.');
  }

  return null;
}

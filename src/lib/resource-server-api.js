const RUNNERS_UTIL_RESOURCE_DOMAIN = 'http://localhost:8080';

export async function getAllRuns(token) {
  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/api/runs`, {
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

export async function getRoutesByUserId(token, userId) {
  const params = new URLSearchParams();
  params.append('userId', userId);

  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/api/routes/by-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`,
    },
    body: params
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch runs.');
  }

  const transformedRoutes = [];

  for (const key in data) {
    const routeObj = {
      id: key,
      ...data[key],
    };

    transformedRoutes.push(routeObj);
  }

  return transformedRoutes;
}

export async function getRouteById(token, routeId) {
  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/api/routes/${routeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not fetch runs.');
  }

  const loadedRoute = {
    id: routeId,
    ...data,
  };

  return loadedRoute;
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

export async function createRun(runData, token) {
  const response = await fetch(`${RUNNERS_UTIL_RESOURCE_DOMAIN}/api/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(runData),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not create run.');
  }

  return null;
}
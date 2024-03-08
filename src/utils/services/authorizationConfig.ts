const authorizationConfig = (access_token: string) => { 
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    }
  }
  return config;
}

export default authorizationConfig;
export const resolveDomain = (userInputDomain?: string) => {
  if (!userInputDomain) {
    return 'https://api.oneai.com';
  }

  if (userInputDomain.startsWith('http')) {
    return userInputDomain;
  }

  if (userInputDomain === 'prod') {
    return 'https://api.oneai.com';
  }

  if (userInputDomain === 'staging') {
    return 'https://staging.oneai.com';
  }

  return `https://${userInputDomain}`;
};

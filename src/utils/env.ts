export const assertEnvVars = (vars: (keyof NodeJS.ProcessEnv)[]): void => {
  const missingVars = vars
    .map(name => ({ name, value: process.env[name] }))
    .filter(({ value }) => !value)
    .map(({ name }) => name);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: [${missingVars
        .map(v => `'${v}'`)
        .join(', ')}]`,
    );
  }
};

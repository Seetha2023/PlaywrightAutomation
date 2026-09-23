export async function retry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 3000
): Promise<T> {

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {

    try {
      return await operation();

    } catch (error) {

      lastError = error;

      console.log(
        `Attempt ${attempt}/${retries} failed. Retrying...`
      );

      if (attempt < retries) {
        await new Promise(resolve =>
          setTimeout(resolve, delayMs)
        );
      }
    }
  }

  throw lastError;
}
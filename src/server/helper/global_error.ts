export const handleError = (error: unknown, defaultMessage: string) => ({
    success: false,
    message: defaultMessage,
    error: error instanceof Error ? error.message : "An unknown error occurred",
});

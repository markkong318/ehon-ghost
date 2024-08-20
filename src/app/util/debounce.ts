export default <T extends (...args: any[]) => unknown>(
  callback: T,
  delay = 250,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), delay)
  }
}

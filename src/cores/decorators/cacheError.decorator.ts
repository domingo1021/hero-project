/**
 * Loose the cache dependency by wrapping the cache errors, if cache malfunction, the application will still work.
 *
 * @returns {Promise<any>}
 */
export const WrapCacheErrors = () => {
  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (err) {
        console.error('Cache Error: ', err.message);
        return null;
      }
    };

    return descriptor;
  };
};

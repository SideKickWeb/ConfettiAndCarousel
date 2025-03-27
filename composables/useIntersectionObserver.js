export const useIntersectionObserver = () => {
  const observeElement = (element, callback, options = {}) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(element);
    return observer;
  };

  return {
    observeElement
  };
}; 
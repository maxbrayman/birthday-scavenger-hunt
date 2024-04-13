import { useEffect, useState } from "react";

const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const [size, setSize] = useState({
    width: window?.innerWidth || initialWidth,
    height: window?.innerHeight || initialHeight,
  });

  useEffect(() => {
    const handler = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return size;
};

export default useWindowSize;

import React, { useEffect, useRef } from "react";

const SCROLL_THRESHOLD = 1000;

export const useInfiniteScroll = ({
  fetchNextPage,
}: {
  fetchNextPage: any;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isLoadingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop } = container;
    

      if (scrollTop <= SCROLL_THRESHOLD) {
        console.log("CONDITION 1 MET: Scroll position is near the top.");
        if (isLoadingRef.current) {
          console.log("CONDITION 2 FAILED: Gate is locked. Returning.");
          return;
        }
        console.log("FETCH TRIGGERED: Locking gate and calling fetchNextPage...");
        isLoadingRef.current = true;

        fetchNextPage(() => {
          isLoadingRef.current = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, containerRef.current]);

  return containerRef;
};

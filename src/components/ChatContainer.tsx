import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { simulateMessages } from "../utils/simulateMessages";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeightBar = useRef(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || pageRef.current === 0) return; // Skip on initial load

    // Calculate the difference in height after the new content has rendered
    const newScrollHeight = container.scrollHeight;
    const heightDifference = newScrollHeight - previousScrollHeightBar.current;

    // Compensate by manually shifting the scroll position down.
    // This makes the user's viewport stay visually fixed.
    container.scrollTop += heightDifference;
  }, [messages]);

  const fetchMessages = useCallback(
    async (onComplete) => {

      if (!hasMore) {
        onComplete();
        return;
      }

      const currentPageToFetch = pageRef.current;

      if (containerRef.current) {
        previousScrollHeightBar.current = containerRef.current.scrollHeight;
      }

      const { messages: newMessages, hasMore: more } = await simulateMessages({
        page: currentPageToFetch,
        pageSize: 20,
      });


      pageRef.current = currentPageToFetch + 1;

      setMessages((prevMessages) => [...newMessages, ...prevMessages]);
      setHasMore(more);
  

      onComplete();
    },
    [hasMore]
  );

  useEffect(() => {
    if (pageRef.current === 0 && messages.length === 0) {
      fetchMessages(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [fetchMessages, messages.length]);

  const infiniteScrollRef = useInfiniteScroll({ fetchNextPage: fetchMessages });
  containerRef.current = infiniteScrollRef.current;

  return (
    <div style={{ padding: "20px" }}>
      <h3>ChatContainer</h3>
      <div
        ref={infiniteScrollRef}
        style={{
          height: "500px",
          width: "500px",
          overflowY: "scroll",
          // display: "flex",
          // flexDirection: "column",
          border: "1px solid #333",
          backgroundColor: "#e5ddd5",
        }}
      >

        {!hasMore && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#888' }}>
            --- Start of Conversation ---
          </div>
        )}

        {messages.length > 0 && hasMore && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            Loading More...
          </div>
        )}

        {messages.map((msg) => {
          const isSelf = msg.sender === "self";

          return (
            <div
              title={msg.sender}
              key={msg.id}
              style={{
                padding: "8px 12px",
                borderRadius: "12px",
                marginBottom: "10px",
                maxWidth: "80%",
                wordWrap: "break-word",
                fontSize: "14px",

                alignSelf: isSelf ? "flex-end" : "flex-start", // Push to right/left
                backgroundColor: isSelf ? "#dcf8c6" : "#ffffff", // Greenish for self, White for other
                color: "#1f1f1f",
                marginLeft: isSelf ? "50%" : "2%", // Spacer margin
                marginRight: isSelf ? "2%" : "50%", // Spacer margin
              }}
            >
              {msg.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

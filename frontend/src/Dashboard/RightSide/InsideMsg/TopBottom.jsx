// components/TopBottom.jsx
import { useEffect, useState } from "react";

const TopBottom = ({ scrollRef, bottomRef }) => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef]);

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all z-50"
        >
          ↓ Scroll to Bottom
        </button>
      )}
    </>
  );
};

export default TopBottom;

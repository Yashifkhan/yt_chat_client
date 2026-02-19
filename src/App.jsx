import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./index.css";

function parseAnswerString(answerStr) {
  if (typeof answerStr !== "string") return { structured: null, plainText: answerStr };

  try {
    const start = answerStr.indexOf("{");
    if (start === -1) return { structured: null, plainText: answerStr };

    let depth = 0;
    let end = -1;
    for (let i = start; i < answerStr.length; i++) {
      if (answerStr[i] === "{") depth++;
      else if (answerStr[i] === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }

    if (end === -1) return { structured: null, plainText: answerStr };

    const jsonStr = answerStr.slice(start, end + 1);
    const structured = JSON.parse(jsonStr);
    const plainText = answerStr.slice(end + 1).trim();

    return { structured, plainText };
  } catch {
    return { structured: null, plainText: answerStr };
  }
}
function StructuredResponse({ structured, plainText }) {
  if (!structured) {
    return <p className="text-gray-200 text-sm leading-relaxed">{plainText}</p>;
  }

  const { main_heading, sections } = structured;

  return (
    <div className="space-y-4">
      {main_heading && (
        <h2 className="text-green-400 font-bold text-base tracking-wide border-b border-gray-700 pb-2">
          {main_heading}
        </h2>
      )}

      {sections?.map((section, i) => (
        <div key={i} className="space-y-2">
          {section.sub_heading && (
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
              {section.sub_heading}
            </h3>
          )}

          {section.description && (
            <p className="text-gray-300 text-sm leading-relaxed">
              {section.description}
            </p>
          )}

          {section.points?.length > 0 && (
            <ul className="space-y-2 mt-1">
              {section.points.map((p, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-200">
                  <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {/* Handle both {point: "..."} object and plain string */}
                  <span>{typeof p === "string" ? p : p.point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {plainText && (
        <p className="text-gray-400 text-xs italic border-t border-gray-700 pt-2 mt-2">
          {plainText}
        </p>
      )}
    </div>
  );
}
function SuggestionChips({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3 pl-1">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="text-xs px-3 py-1.5 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-all duration-150 cursor-pointer"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
export default function App() {
  const [query, setquery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendQuestion = async (question) => {
    if (!question.trim()) return;

    setChat(prev => [...prev, { role: "user", text: question }]);
    setLoading(true);
    setquery("");

    try {
      const resp = await axios.post("http://127.0.0.1:8000/api/v1/yt_chat", { question });
      const data = resp?.data;

      const { structured, plainText } = parseAnswerString(data?.answer ?? "");

      const suggestions = structured?.suggestions ?? [];

      const cleanStructured = structured
        ? { ...structured, suggestions: undefined }
        : null;

      setChat(prev => [
        ...prev,
        { role: "ai", structured: cleanStructured, plainText, suggestions }
      ]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { role: "ai", structured: null, plainText: "Something went wrong. Please try again.", suggestions: [] }
      ]);
    }

    setLoading(false);
  };

  const handleAsk = () => sendQuestion(query);

  // Clicking a chip auto-sends that question directly
  const handleChipClick = (suggestion) => sendQuestion(suggestion);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[600px] bg-gray-950 shadow-2xl rounded-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            Emo YouTube Assistant
          </h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-950">

          {chat.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              Ask something about your videos...
            </div>
          )}

          {chat.map((msg, index) => {
            const isLastAI = msg.role === "ai" && index === chat.length - 1;

            return (
              <div key={index}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-1.5 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    {msg.role === "ai" ? (
                      <StructuredResponse structured={msg.structured} plainText={msg.plainText} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>

                {/* Show suggestion chips only below the last AI message and not while loading */}
                {isLastAI && !loading && (
                  <SuggestionChips
                    suggestions={msg.suggestions}
                    onSelect={handleChipClick}
                  />
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-xl">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800 flex items-end gap-2 bg-gray-900">
          <textarea
            rows={1}
            placeholder="Ask something about videos... (Enter to send)"
            value={query}
            onChange={(e) => {
              setquery(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white outline-none resize-none overflow-hidden focus:ring-2 focus:ring-green-500 max-h-40"
          />
          <button
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white transition"
          >
            Ask
          </button>
        </div>

      </div>
    </div>
  );
}
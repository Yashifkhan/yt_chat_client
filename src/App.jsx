import { useState } from "react";
import './App.css'
import axios from "axios";


function App() {

  const [videoUrl, setVideoUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLoadVideo = async () => {
    if (!videoUrl) return;
    setLoading(true);

    await fetch("http://localhost:5000/load-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl })
    });

    setLoading(false);
    alert("Video Loaded Successfully");
  };

  const handleAsk = async () => {
    if (!question) return;

    setChat([...chat, { role: "user", text: question }]);
    setLoading(true);

    console.log("question",question);
    
    const resp = await axios.post("http://127.0.0.1:8000/api/v1/yt_chat",{question} );
    console.log("resp",resp);
    

    const data = await resp?.data

    setChat(prev => [
      ...prev,
      { role: "ai", text: data.answer }
    ]);

    setQuestion("");
    setLoading(false);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">

  <div className="w-full max-w-3xl h-150 bg-gray-950 shadow-2xl rounded-2xl flex flex-col overflow-hidden">

    {/* Header */}
    <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
      <h1 className="text-xl font-semibold text-white tracking-wide">
        AI YouTube Assistant
      </h1>
    </div>

    {/* Video Input */}
    <div className="p-4 border-b border-gray-800 flex gap-2 bg-gray-900">
      <input
        type="text"
        placeholder="Paste YouTube Video URL..."
        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-purple-500"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button
        onClick={handleLoadVideo}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition"
      >
        Load
      </button>
    </div>

    {/* Chat Area */}
    <div className="flex-1 h-[450px] overflow-y-auto px-4 py-3 space-y-3 bg-gray-950">

      {chat.map((msg, index) => (
        <div
          key={index}
          className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
            msg.role === "user"
              ? "ml-auto bg-blue-600 text-white"
              : "mr-auto bg-gray-800 text-gray-100"
          }`}
        >
          {msg.text}
        </div>
      ))}

      {loading && (
        <div className="text-gray-400 text-sm animate-pulse">
          AI is thinking...
        </div>
      )}

    </div>

    {/* Ask Question */}
    <div className="p-4 border-t border-gray-800 flex gap-2 bg-gray-900">
      <input
        type="text"
        placeholder="Ask something about this video..."
        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-green-500"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={handleAsk}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition"
      >
        Ask
      </button>
    </div>

  </div>

</div>

  );
}

export default App;

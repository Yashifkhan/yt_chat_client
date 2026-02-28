// import { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import "./index.css";

// function parseAnswerString(answerStr) {
//   if (typeof answerStr !== "string") return { structured: null, plainText: answerStr };

//   try {
//     const start = answerStr.indexOf("{");
//     if (start === -1) return { structured: null, plainText: answerStr };

//     let depth = 0;
//     let end = -1;
//     for (let i = start; i < answerStr.length; i++) {
//       if (answerStr[i] === "{") depth++;
//       else if (answerStr[i] === "}") {
//         depth--;
//         if (depth === 0) { end = i; break; }
//       }
//     }

//     if (end === -1) return { structured: null, plainText: answerStr };

//     const jsonStr = answerStr.slice(start, end + 1);
//     const structured = JSON.parse(jsonStr);
//     const plainText = answerStr.slice(end + 1).trim();

//     return { structured, plainText };
//   } catch {
//     return { structured: null, plainText: answerStr };
//   }
// }
// function StructuredResponse({ structured, plainText }) {
//   if (!structured) {
//     return <p className="text-gray-200 text-sm leading-relaxed">{plainText}</p>;
//   }

//   const { main_heading, sections } = structured;

//   return (
//     <div className="space-y-4">
//       {main_heading && (
//         <h2 className="text-green-400 font-bold text-base tracking-wide border-b border-gray-700 pb-2">
//           {main_heading}
//         </h2>
//       )}

//       {sections?.map((section, i) => (
//         <div key={i} className="space-y-2">
//           {section.sub_heading && (
//             <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
//               {section.sub_heading}
//             </h3>
//           )}

//           {section.description && (
//             <p className="text-gray-300 text-sm leading-relaxed">
//               {section.description}
//             </p>
//           )}

//           {section.points?.length > 0 && (
//             <ul className="space-y-2 mt-1">
//               {section.points.map((p, j) => (
//                 <li key={j} className="flex items-start gap-2 text-sm text-gray-200">
//                   <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
//                   {/* Handle both {point: "..."} object and plain string */}
//                   <span>{typeof p === "string" ? p : p.point}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       ))}

//       {plainText && (
//         <p className="text-gray-400 text-xs italic border-t border-gray-700 pt-2 mt-2">
//           {plainText}
//         </p>
//       )}
//     </div>
//   );
// }
// function SuggestionChips({ suggestions, onSelect }) {
//   if (!suggestions?.length) return null;
//   return (
//     <div className="flex flex-wrap gap-2 mt-3 pl-1">
//       {suggestions.map((s, i) => (
//         <button
//           key={i}
//           onClick={() => onSelect(s)}
//           className="text-xs px-3 py-1.5 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-all duration-150 cursor-pointer"
//         >
//           {s}
//         </button>
//       ))}
//     </div>
//   );
// }
// export default function App() {
//   const [query, setquery] = useState("");
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef(null);
//   const [selectedModel, setSelectedModel] = useState("emo-4-scout");
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, loading]);

//   const sendQuestion = async (question) => {
//     if (!question.trim()) return;

//     setChat(prev => [...prev, { role: "user", text: question }]);
//     setLoading(true);
//     setquery("");

//     try {
//       const resp = await axios.post("http://127.0.0.1:8000/api/v1/yt_chat", { question ,model: selectedModel});
//       const data = resp?.data;

//       const { structured, plainText } = parseAnswerString(data?.answer ?? "");

//       const suggestions = structured?.suggestions ?? [];

//       const cleanStructured = structured
//         ? { ...structured, suggestions: undefined }
//         : null;

//       setChat(prev => [
//         ...prev,
//         { role: "ai", structured: cleanStructured, plainText, suggestions }
//       ]);
//     } catch (err) {
//       setChat(prev => [
//         ...prev,
//         { role: "ai", structured: null, plainText: "Something went wrong. Please try again.", suggestions: [] }
//       ]);
//     }

//     setLoading(false);
//   };

//   const handleAsk = () => sendQuestion(query);

//   const handleChipClick = (suggestion) => sendQuestion(suggestion);

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleAsk();
//     }
//   };

// const models = [
//   { value: "emo-4-scout", label: "emo-scout" },
//   { value: "emo-oss", label: "emo-oss" },
// ];

//   return (
//   <div className="min-h-screen min-h-dvh bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-0 sm:p-4">
//   <div className="
//     w-full max-w-3xl bg-gray-950 shadow-2xl flex flex-col
//     h-screen sm:h-[600px] md:h-[680px]
//     rounded-none sm:rounded-2xl
//   ">

//     {/* Header */}
//     <div className="bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-800 shrink-0">
//       <h1 className="text-base sm:text-lg font-semibold text-white tracking-wide">
//         Emo YouTube Agent
//       </h1>
//     </div>

//     {/* Chat Area */}
//     <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 bg-gray-950 min-h-0">

//       {chat.length === 0 && (
//         <div className="flex items-center justify-center h-full text-gray-600 text-sm text-center px-4">
//           Ask something about your videos...
//         </div>
//       )}

//       {chat.map((msg, index) => {
//         const isLastAI = msg.role === "ai" && index === chat.length - 1;

//         return (
//           <div key={index}>
//             <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`max-w-[90%] sm:max-w-[85%] px-3 sm:px-4 py-2 rounded-xl text-sm ${
//                   msg.role === "user"
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-800 text-gray-100"
//                 }`}
//               >
//                 {msg.role === "ai" ? (
//                   <StructuredResponse structured={msg.structured} plainText={msg.plainText} />
//                 ) : (
//                   msg.text
//                 )}
//               </div>
//             </div>

//             {isLastAI && !loading && (
//               <SuggestionChips
//                 suggestions={msg.suggestions}
//                 onSelect={handleChipClick}
//               />
//             )}
//           </div>
//         );
//       })}

//       {loading && (
//         <div className="flex justify-start">
//           <div className="bg-gray-800 px-4 py-3 rounded-xl">
//             <div className="flex gap-1.5 items-center">
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:0ms]" />
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:150ms]" />
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce [animation-delay:300ms]" />
//             </div>
//           </div>
//         </div>
//       )}

//       <div ref={bottomRef} />
//     </div>

//    <div className="px-3 sm:px-4 pt-2 pb-3 sm:pb-4 border-t border-gray-800 flex flex-col gap-2 bg-gray-900 shrink-0">
  
  

//   {/* Input Row */}
//   <div className="flex items-end gap-2">
//     {/* Model Selector */}
//   {/* Custom Dropdown - opens upward */}
// <div className="relative">

//   {/* Options - positioned above */}
//   {isOpen && (
//     <div className="absolute bottom-full mb-1 left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10 shadow-lg">
//       {models.map((m) => (
//         <div
//           key={m.value}
//           onClick={() => { setSelectedModel(m.value); setIsOpen(false); }}
//           className={`px-3 py-1.5 text-xs cursor-pointer transition hover:bg-gray-700 ${
//             selectedModel === m.value ? "text-green-400" : "text-gray-300"
//           }`}
//         >
//           {m.label}
//         </div>
//       ))}
//     </div>
//   )}

//   {/* Trigger Button */}
//   <button
//     onClick={() => setIsOpen(!isOpen)}
//     className="w-full flex items-center justify-between gap-1 text-xs bg-gray-800 text-gray-300 rounded-lg px-2 py-2 outline-none focus:ring-1 focus:ring-green-500 hover:bg-gray-700 transition"
//   >
//     <span>{models.find(m => m.value === selectedModel)?.label}</span>
//     <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▾</span>
//   </button>

// </div>
//     <textarea
//       rows={1}
//       placeholder="Ask something..."
//       value={query}
//       onChange={(e) => {
//         setquery(e.target.value);
//         e.target.style.height = "auto";
//         e.target.style.height = e.target.scrollHeight + "px";
//       }}
//       onKeyDown={handleKeyDown}
//       className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white text-xs outline-none resize-none overflow-hidden focus:ring-2 focus:ring-green-500 max-h-32 sm:max-h-40"
//     />
//     <button
//       onClick={handleAsk}
//       disabled={loading || !query.trim()}
//       className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-4 py-2 rounded-lg text-white text-xs transition shrink-0"
//     >
//       Ask
//     </button>
//   </div>

// </div>

//   </div>
// </div>
//   );
// }






import { useState, useRef, useEffect } from "react";
import axios from "axios";

/* ─── Helpers ─────────────────────────────────────────────────── */
function parseAnswerString(answerStr) {
  if (typeof answerStr !== "string") return { structured: null, plainText: answerStr };
  try {
    const start = answerStr.indexOf("{");
    if (start === -1) return { structured: null, plainText: answerStr };
    let depth = 0, end = -1;
    for (let i = start; i < answerStr.length; i++) {
      if (answerStr[i] === "{") depth++;
      else if (answerStr[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) return { structured: null, plainText: answerStr };
    const structured = JSON.parse(answerStr.slice(start, end + 1));
    const plainText = answerStr.slice(end + 1).trim();
    return { structured, plainText };
  } catch { return { structured: null, plainText: answerStr }; }
}

/* ─── Icons ───────────────────────────────────────────────────── */
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}>
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{width:11,height:11,transition:"transform 0.2s",transform:open?"rotate(180deg)":"none"}}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20}}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/>
    <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5"/><line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5"/>
  </svg>
);
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="#ef4444" style={{width:12,height:12}}>
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

function TypingDots() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,padding:"2px 0"}}>
      {[0,1,2].map(i=>(
        <span key={i} style={{
          width:7,height:7,borderRadius:"50%",background:"#dc2626",display:"inline-block",
          animation:`typingBounce 1.2s ease-in-out ${i*0.2}s infinite`
        }}/>
      ))}
    </div>
  );
}

function StructuredResponse({ structured, plainText }) {
  if (!structured) return <p style={{color:"#d0d0d0",fontSize:13,lineHeight:1.65}}>{plainText}</p>;
  const { main_heading, sections } = structured;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {main_heading && (
        <div style={{display:"flex",alignItems:"center",gap:7,paddingBottom:10,borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <SparkleIcon/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"#f87171",letterSpacing:"0.02em"}}>{main_heading}</h2>
        </div>
      )}
      {sections?.map((section,i)=>(
        <div key={i} style={{display:"flex",flexDirection:"column",gap:6}}>
          {section.sub_heading && <h3 style={{fontSize:10,fontWeight:600,color:"#666",textTransform:"uppercase",letterSpacing:"0.1em"}}>{section.sub_heading}</h3>}
          {section.description && <p style={{color:"#b8b8b8",fontSize:13,lineHeight:1.65}}>{section.description}</p>}
          {section.points?.length>0 && (
            <ul style={{display:"flex",flexDirection:"column",gap:6,marginTop:2}}>
              {section.points.map((p,j)=>(
                <li key={j} style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:13,color:"#c8c8c8",lineHeight:1.55}}>
                  <span style={{marginTop:7,width:4,height:4,borderRadius:"50%",background:"#dc2626",flexShrink:0,opacity:0.8}}/>
                  <span>{typeof p==="string"?p:p.point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {plainText && <p style={{color:"#555",fontSize:11,fontStyle:"italic",borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:8}}>{plainText}</p>}
    </div>
  );
}

/* ─── Suggestion Chips ────────────────────────────────────────── */
function SuggestionChips({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:10,marginLeft:36}}>
      {suggestions.map((s,i)=>(
        <button key={i} onClick={()=>onSelect(s)} style={{
          fontSize:11,padding:"5px 12px",borderRadius:100,
          border:"1px solid rgba(220,38,38,0.35)",color:"#f87171",
          background:"rgba(220,38,38,0.07)",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif",
          transition:"all 0.2s",
          animation:`fadeSlideIn 0.3s ease ${i*0.07}s both`,
        }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(220,38,38,0.2)";e.currentTarget.style.borderColor="rgba(220,38,38,0.6)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(220,38,38,0.07)";e.currentTarget.style.borderColor="rgba(220,38,38,0.35)";}}
        >{s}</button>
      ))}
    </div>
  );
}

/* ─── Message ─────────────────────────────────────────────────── */
function Message({msg,isLast,loading,onChipClick}){
  const isUser=msg.role==="user";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:0,animation:"fadeSlideIn 0.35s ease both"}}>
      <div style={{display:"flex",gap:10,flexDirection:isUser?"row-reverse":"row",alignItems:"flex-end"}}>
        {!isUser&&(
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            boxShadow:"0 4px 14px rgba(220,38,38,0.35)",marginBottom:2}}>
            <BotIcon/>
          </div>
        )}
        <div style={{
          maxWidth:"78%",padding:"10px 14px",fontSize:13,lineHeight:1.65,
          borderRadius:isUser?"16px 16px 4px 16px":"16px 16px 16px 4px",
          background:isUser?"linear-gradient(135deg,#dc2626,#b91c1c)":"#18181d",
          color:isUser?"#fff":"#d8d8d8",
          border:isUser?"none":"1px solid rgba(255,255,255,0.07)",
          boxShadow:isUser?"0 4px 18px rgba(220,38,38,0.3)":"0 2px 12px rgba(0,0,0,0.4)",
        }}>
          {isUser?<p>{msg.text}</p>:<StructuredResponse structured={msg.structured} plainText={msg.plainText}/>}
        </div>
        {isUser&&(
          <div style={{width:28,height:28,borderRadius:8,background:"#1c1c22",
            display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,border:"1px solid rgba(255,255,255,0.08)",marginBottom:2}}>
            <span style={{fontSize:11,color:"#555"}}>U</span>
          </div>
        )}
      </div>
      {isLast&&!loading&&!isUser&&<SuggestionChips suggestions={msg.suggestions} onSelect={onChipClick}/>}
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────────── */
function EmptyState(){
  const hints=["Summarize this video","Key takeaways","Explain in simple terms","What topics are covered?"];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:20,padding:"24px",textAlign:"center"}}>
      <div style={{position:"relative"}}>
        <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 8px 32px rgba(220,38,38,0.45)"}}>
          <YouTubeIcon/>
        </div>
        <div style={{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:"50%",
          background:"linear-gradient(135deg,#f87171,#dc2626)",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 2px 8px rgba(220,38,38,0.5)"}}>
          <SparkleIcon/>
        </div>
      </div>
      <div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"0.01em",marginBottom:6}}>
          Emo YouTube Agent
        </h2>
        <p style={{fontSize:13,color:"#555",lineHeight:1.6,maxWidth:280}}>
          Ask me anything about your videos — I'll summarize, explain, or dive deep into any topic.
        </p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:320}}>
        {hints.map((h,i)=>(
          <span key={i} style={{
            fontSize:11,padding:"5px 12px",borderRadius:100,
            background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",color:"#444"
          }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── App ─────────────────────────────────────────────────────── */
export default function App(){
  const [query,setQuery]=useState("");
  const [chat,setChat]=useState([]);
  const [loading,setLoading]=useState(false);
  const [selectedModel,setSelectedModel]=useState("emo-4-scout");
  const [dropdownOpen,setDropdownOpen]=useState(false);
  const bottomRef=useRef(null);
  const textareaRef=useRef(null);
  const inputWrapRef=useRef(null);

  const models=[
    {value:"emo-4-scout",label:"emo-scout",badge:"Fast"},
    {value:"emo-oss",label:"emo-oss",badge:"Open"},
  ];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[chat,loading]);

  const sendQuestion=async(question)=>{
    if(!question.trim())return;
    setChat(prev=>[...prev,{role:"user",text:question}]);
    setLoading(true);setQuery("");
    if(textareaRef.current)textareaRef.current.style.height="auto";
    try{
      const resp=await axios.post("http://127.0.0.1:8000/api/v1/yt_chat",{question,model:selectedModel});
      const {structured,plainText}=parseAnswerString(resp?.data?.answer??"");
      const suggestions=structured?.suggestions??[];
      const cleanStructured=structured?{...structured,suggestions:undefined}:null;
      setChat(prev=>[...prev,{role:"ai",structured:cleanStructured,plainText,suggestions}]);
    }catch{
      setChat(prev=>[...prev,{role:"ai",structured:null,plainText:"Something went wrong. Please try again.",suggestions:[]}]);
    }
    setLoading(false);
  };

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;font-family:'DM Sans',sans-serif;background:#0a0a0d;}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:0.35;}30%{transform:translateY(-7px);opacity:1;}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.4);}50%{box-shadow:0 0 0 7px rgba(220,38,38,0);}}
        .chat-scroll::-webkit-scrollbar{width:3px;}
        .chat-scroll::-webkit-scrollbar-track{background:transparent;}
        .chat-scroll::-webkit-scrollbar-thumb{background:#222228;border-radius:4px;}
        .send-active{animation:glowPulse 2s infinite;}
        textarea::placeholder{color:#333;}
      `}</style>

      <div style={{
        minHeight:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",
        background:"radial-gradient(ellipse 70% 50% at 50% -10%,rgba(220,38,38,0.08),transparent),#0a0a0d",
      }}>
        {/* Card */}
        <div style={{
          width:"100%",maxWidth:720,height:"100dvh",
          display:"flex",flexDirection:"column",
          background:"#111116",
          borderLeft:"1px solid rgba(255,255,255,0.04)",
          borderRight:"1px solid rgba(255,255,255,0.04)",
          position:"relative",overflow:"hidden",
        }} className="sm:rounded-2xl sm:h-[720px] sm:shadow-2xl">

          {/* Subtle top highlight */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:1,
            background:"linear-gradient(90deg,transparent,rgba(220,38,38,0.4),transparent)",
            zIndex:10}}/>

          {/* Header */}
          <div style={{
            padding:"14px 20px",
            background:"linear-gradient(180deg,#161619 0%,#111116 100%)",
            borderBottom:"1px solid rgba(255,255,255,0.05)",
            display:"flex",alignItems:"center",gap:12,flexShrink:0,
          }}>
            <div style={{
              width:38,height:38,borderRadius:11,flexShrink:0,
              background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 20px rgba(220,38,38,0.4)",
            }}>
              <YouTubeIcon/>
            </div>
            <div>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"0.01em"}}>
                Emo YouTube Agent
              </h1>
              <p style={{fontSize:11,color:"#444",marginTop:1}}>Video intelligence · AI-powered</p>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",flexShrink:0,
                boxShadow:"0 0 8px rgba(34,197,94,0.7)"}}/>
              <span style={{fontSize:10,color:"#3a3a40",fontWeight:500}}>Online</span>
            </div>
          </div>

          {/* Chat */}
          <div className="chat-scroll" style={{
            flex:1,overflowY:"auto",padding:"20px 16px",
            display:"flex",flexDirection:"column",gap:18,minHeight:0,
          }}>
            {chat.length===0&&<EmptyState/>}
            {chat.map((msg,i)=>(
              <Message key={i} msg={msg} isLast={i===chat.length-1}
                loading={loading} onChipClick={sendQuestion}/>
            ))}
            {loading&&(
              <div style={{display:"flex",gap:10,alignItems:"flex-end",animation:"fadeSlideIn 0.3s ease both"}}>
                <div style={{width:28,height:28,borderRadius:8,flexShrink:0,
                  background:"linear-gradient(135deg,#dc2626,#7f1d1d)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 4px 14px rgba(220,38,38,0.35)"}}>
                  <BotIcon/>
                </div>
                <div style={{background:"#18181d",border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:"14px 14px 14px 4px",padding:"12px 16px"}}>
                  <TypingDots/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input Panel */}
          <div style={{padding:"10px 16px 18px",borderTop:"1px solid rgba(255,255,255,0.05)",background:"#0d0d11",flexShrink:0}}>
            {/* Top row: model + char count */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:10,color:"#333",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.08em"}}>Model</span>
              <div style={{position:"relative"}}>
                {dropdownOpen&&(
                  <div style={{
                    position:"absolute",bottom:"calc(100% + 6px)",left:0,
                    background:"#1c1c24",border:"1px solid rgba(255,255,255,0.09)",
                    borderRadius:10,overflow:"hidden",zIndex:30,minWidth:140,
                    boxShadow:"0 -12px 40px rgba(0,0,0,0.6)",animation:"fadeSlideIn 0.15s ease",
                  }}>
                    {models.map(m=>(
                      <div key={m.value} onClick={()=>{setSelectedModel(m.value);setDropdownOpen(false);}}
                        style={{
                          padding:"8px 12px",cursor:"pointer",fontSize:12,
                          display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,
                          color:selectedModel===m.value?"#f87171":"#999",
                          background:selectedModel===m.value?"rgba(220,38,38,0.1)":"transparent",
                          transition:"background 0.15s",fontFamily:"'DM Sans',sans-serif",
                        }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                        onMouseLeave={e=>e.currentTarget.style.background=selectedModel===m.value?"rgba(220,38,38,0.1)":"transparent"}
                      >
                        <span style={{fontWeight:500}}>{m.label}</span>
                        <span style={{fontSize:9,padding:"2px 5px",borderRadius:4,
                          background:"rgba(255,255,255,0.06)",color:"#555",
                          textTransform:"uppercase",letterSpacing:"0.07em"}}>{m.badge}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={()=>setDropdownOpen(o=>!o)} style={{
                  display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
                  background:"#1c1c24",border:"1px solid rgba(255,255,255,0.08)",
                  borderRadius:8,cursor:"pointer",fontSize:12,color:"#f87171",
                  fontWeight:500,fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s",
                }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(220,38,38,0.5)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}
                >
                  {models.find(m=>m.value===selectedModel)?.label}
                  <ChevronIcon open={dropdownOpen}/>
                </button>
              </div>
              {query.length>0&&(
                <span style={{fontSize:10,color:"#2a2a35",marginLeft:"auto"}}>
                  {query.length} chars
                </span>
              )}
            </div>

            {/* Textarea + Button */}
            <div ref={inputWrapRef} style={{
              display:"flex",gap:8,alignItems:"flex-end",
              background:"#18181d",borderRadius:14,
              border:"1px solid rgba(255,255,255,0.07)",
              padding:"4px 4px 4px 14px",
              transition:"border-color 0.2s, box-shadow 0.2s",
            }}
            onFocusCapture={e=>{e.currentTarget.style.borderColor="rgba(220,38,38,0.4)";e.currentTarget.style.boxShadow="0 0 0 3px rgba(220,38,38,0.07)";}}
            onBlurCapture={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.boxShadow="none";}}
            >
              <textarea ref={textareaRef} rows={1} value={query}
                placeholder="Ask something about the video…"
                onChange={e=>{
                  setQuery(e.target.value);
                  e.target.style.height="auto";
                  e.target.style.height=Math.min(e.target.scrollHeight,128)+"px";
                }}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendQuestion(query);}}}
                style={{
                  flex:1,background:"transparent",border:"none",outline:"none",
                  color:"#e0e0e0",fontSize:13,lineHeight:1.6,resize:"none",
                  padding:"9px 0",maxHeight:128,overflow:"auto",
                  fontFamily:"'DM Sans',sans-serif",
                }}
              />
              <button onClick={()=>sendQuestion(query)}
                disabled={loading||!query.trim()}
                className={!loading&&query.trim()?"send-active":""}
                style={{
                  width:38,height:38,borderRadius:10,border:"none",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                  background:!loading&&query.trim()?"linear-gradient(135deg,#dc2626,#b91c1c)":"#1a1a22",
                  color:!loading&&query.trim()?"#fff":"#2a2a35",
                  transition:"all 0.2s",opacity:loading?0.5:1,
                }}
                onMouseEnter={e=>{if(!loading&&query.trim())e.currentTarget.style.transform="scale(1.06)";}}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              >
                <SendIcon/>
              </button>
            </div>

            <p style={{textAlign:"center",fontSize:10,color:"#222228",marginTop:8,letterSpacing:"0.02em"}}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  );
}





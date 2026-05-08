import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { server } from "../../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../styles/styles";
import { format } from "timeago.js";

const ENDPOINT = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["polling"] });

const AdminDashboardMessages = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-user/${user?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const sellerId = user?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user?._id
    );

    socketId.emit("sendMessage", {
      senderId: user?._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: user._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: user._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-[90%] bg-white shadow-lg m-5 h-[85vh] flex flex-col rounded-2xl overflow-hidden border border-gray-100">
      {!open && (
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 shrink-0">
            <h1 className="text-white text-2xl font-bold font-Poppins tracking-tight">
              Admin Messages Support
            </h1>
            <p className="text-indigo-100 text-sm mt-1">Manage and assist users across the platform</p>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2">
            {conversations && conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((item, index) => (
                  <MessageList
                    data={item}
                    key={index}
                    index={index}
                    setOpen={setOpen}
                    setCurrentChat={setCurrentChat}
                    me={user?._id}
                    setUserData={setUserData}
                    userData={userData}
                    online={onlineCheck(item)}
                    setActiveStatus={setActiveStatus}
                    loading={loading}
                  />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-1">Platform support requests will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {open && (
        <div className="flex flex-col h-full bg-white">
          <AdminInbox
            setOpen={setOpen}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessageHandler={sendMessageHandler}
            messages={messages}
            sellerId={user._id}
            userData={userData}
            activeStatus={activeStatus}
            scrollRef={scrollRef}
            handleImageUpload={handleImageUpload}
          />
        </div>
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/admin-messages?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        try {
          const res = await axios.get(`${server}/user/user-info/${userId}`);
          setUser(res.data.user);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getUser();
  }, [me, data, online, setActiveStatus]);

  return (
    <div
      className={`w-full flex items-center p-4 rounded-2xl transition-all duration-200 ${
        active === index ? "bg-indigo-50 shadow-sm border border-indigo-100" : "bg-white hover:bg-gray-50 border border-transparent shadow-sm"
      } cursor-pointer`}
      onClick={(e) => {
        setActive(index);
        handleClick(data._id);
        setCurrentChat(data);
        setUserData(user);
        setActiveStatus(online);
      }}
    >
      <div className="relative shrink-0">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {online ? (
          <div className="w-4 h-4 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white shadow-sm" />
        ) : (
          <div className="w-4 h-4 bg-gray-300 rounded-full absolute bottom-0 right-0 border-2 border-white shadow-sm" />
        )}
      </div>
      <div className="pl-4 flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-[17px] font-semibold text-gray-900 truncate">{user?.name}</h1>
        </div>
        <p className="text-[12px] font-medium text-indigo-500 uppercase tracking-wide mb-0.5">{user?.role}</p>
        <p className="text-[14px] text-gray-500 truncate">
          {!loading && data?.lastMessageId !== userData?._id
            ? <span className="font-medium text-indigo-600">You: </span>
            : ""}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const AdminInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#f0f2f5] relative">
      {/* message header */}
      <div className="w-full flex items-center justify-between bg-white px-6 py-4 shadow-sm z-10 shrink-0 border-b border-gray-200">
        <div className="flex items-center">
          <button 
            onClick={() => setOpen(false)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <AiOutlineArrowRight size={22} className="transform rotate-180" />
          </button>
          <div className="relative">
            <img
              src={`${userData?.avatar?.url}`}
              alt=""
              className="w-12 h-12 rounded-full object-cover border border-gray-100"
            />
            {activeStatus && <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />}
          </div>
          <div className="pl-4">
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               {userData?.name}
               <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">{userData?.role}</span>
            </h1>
            <h1 className="text-xs font-medium text-gray-500">{activeStatus ? "Online" : "Offline"}</h1>
          </div>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 px-4 py-6 overflow-y-auto" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/always-grey.png')", backgroundBlendMode: "multiply" }}>
        {messages && messages.length > 0 ? (
          messages.map((item, index) => {
            const isMe = item.sender === sellerId;
            return (
              <div
                key={index}
                className={`flex w-full my-3 ${isMe ? "justify-end" : "justify-start"}`}
                ref={index === messages.length - 1 ? scrollRef : null}
              >
                {!isMe && (
                  <img
                    src={`${userData?.avatar?.url}`}
                    className="w-8 h-8 rounded-full mr-2 self-end shrink-0"
                    alt=""
                  />
                )}
                
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                  {item.images && (
                    <div className={`p-1 bg-white rounded-2xl shadow-sm mb-1 ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}>
                       <img
                         src={`${item.images?.url}`}
                         className="w-64 h-auto max-h-64 object-cover rounded-xl"
                         alt="attachment"
                       />
                    </div>
                  )}
                  {item.text !== "" && (
                    <div
                      className={`px-4 py-2.5 shadow-sm text-[15px] leading-relaxed relative ${
                        isMe 
                          ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm" 
                          : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
                      }`}
                    >
                      <p className="break-words">{item.text}</p>
                    </div>
                  )}
                  <p className={`text-[11px] text-gray-500 font-medium mt-1 mx-1 ${isMe ? "text-right" : "text-left"}`}>
                    {format(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex items-center justify-center">
             <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-500 font-medium shadow-sm">
                Say hello to {userData?.name}! 👋
             </div>
          </div>
        )}
      </div>

      {/* send message input */}
      <div className="bg-white px-4 py-4 shrink-0 border-t border-gray-200">
        <form
          className="max-w-4xl mx-auto relative flex items-center gap-3 bg-gray-100 rounded-full pl-4 pr-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:bg-white transition-all shadow-inner"
          onSubmit={sendMessageHandler}
        >
          <div className="shrink-0 flex items-center justify-center">
            <input
              type="file"
              name=""
              id="image"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="image" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer transition-colors">
              <TfiGallery size={22} />
            </label>
          </div>
          
          <input
            type="text"
            required
            placeholder="Type a support message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-500 text-[15px] py-2"
          />
          
          <button 
            type="submit" 
            disabled={!newMessage.trim() && !newMessage}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              newMessage.trim() ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <AiOutlineSend size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboardMessages;

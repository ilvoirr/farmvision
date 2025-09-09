"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { useState, type KeyboardEvent, useCallback } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconMessageCircle,
  IconHistory,
  IconPlant,
  IconPackage,
  IconGift,
  IconTool,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

type UserMessage = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="max-w-[70%] rounded-lg px-4 py-3 bg-white text-black border border-gray-200">
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <span className="text-sm text-gray-500 ml-2">...</span>
      </div>
    </div>
  </div>
);

const Logo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
      >
        <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" />
        <path d="M16 18h-5" />
        <path d="M18 5a1 1 0 0 0-1 1v5.573" />
        <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" />
        <path d="M4 11V4" />
        <path d="M7 15h.01" />
        <path d="M8 10.1V4" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="7" cy="15" r="5" />
      </svg>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[1.6vw] font-semibold tracking-tight text-black"
      >
        FarmVision
      </motion.span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
      >
        <path d="m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" />
        <path d="M16 18h-5" />
        <path d="M18 5a1 1 0 0 0-1 1v5.573" />
        <path d="M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" />
        <path d="M4 11V4" />
        <path d="M7 15h.01" />
        <path d="M8 10.1V4" />
        <circle cx="18" cy="18" r="2" />
        <circle cx="7" cy="15" r="5" />
      </svg>
    </div>
  );
};

export default function AppPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(false);
    setIsTyping(false);
  };

  const links = [
    {
      label: "New Chat",
      href: "#",
      icon: (
        <IconMessageCircle className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
      onClick: handleNewChat,
    },
    {
      label: "Inventory Management",
      href: "/inventory",
      icon: (
        <IconPackage className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
      onClick: () => router.push('/inventory'),
    },
    {
      label: "Scheme Recommendation",
      href: "/scheme",
      icon: (
        <IconGift className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
      onClick: () => router.push('/scheme'),
    },
    {
      label: "Hardware Tool Kit",
      href: "/hardware",
      icon: (
        <IconTool className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
      onClick: () => router.push('/hardware'),
    },
  ];

  const handleLanguageSwitch = useCallback((language: 'en' | 'hi') => {
    setCurrentLanguage(language);
  }, []);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  const typeWriterEffect = useCallback((text: string, messageId: number) => {
    setIsTyping(true);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, text: text.slice(0, currentIndex + 1) }
            : msg
        )
      );
      
      currentIndex++;
      
      if (currentIndex >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 10);
    
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    const messageText = inputValue.trim();
    
    if (messageText || selectedImage) {
      const newMessage: UserMessage = {
        id: Date.now(),
        text: selectedImage ? `[Image uploaded] ${messageText}` : messageText,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        let response;
        
        if (selectedImage) {
          const formData = new FormData();
          formData.append('image', selectedImage);
          formData.append('message', messageText);
          formData.append('language', currentLanguage);
          
          response = await fetch('/api/gemini', {
            method: 'POST',
            body: formData
          });
          
          setSelectedImage(null);
          setImagePreview(null);
        } else {
          response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: messageText,
              language: currentLanguage
            })
          });
        }

        const data = await response.json();
        setIsLoading(false);
        
        const botMessageId = Date.now() + 1;
        const botResponse: UserMessage = {
          id: botMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botResponse]);
        typeWriterEffect(data.message, botMessageId);
        
      } catch (error) {
        setIsLoading(false);
        const errorResponse: UserMessage = {
          id: Date.now() + 1,
          text: currentLanguage === 'hi' 
            ? "क्षमा करें, कनेक्शन में समस्या है। कृपया फिर से कोशिश करें।"
            : "Sorry, I'm having trouble connecting. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasContent = inputValue.trim().length > 0 || selectedImage;

  return (
    <>
      <SignedIn>
        <div className={cn(
          "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row",
          "h-screen"
        )}>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                <div 
                  className="cursor-pointer"
                  onMouseEnter={() => setSidebarOpen(true)}
                  onMouseLeave={() => setSidebarOpen(false)}
                >
                  {sidebarOpen ? <Logo /> : <LogoIcon />}
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <div key={idx} onClick={link.onClick} className="cursor-pointer">
                      <SidebarLink link={link} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: user?.username || 'User',
                    href: "#",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                        {(user?.username?.[0] || user?.firstName?.[0] || 'U').toUpperCase()}
                      </div>
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>

          {/* Main Chat Area */}
          <div className="flex flex-1 flex-col">
            {/* Top Navbar */}
            <div className="flex items-center h-[9.5vh] bg-gray-100 px-8 shadow-sm border-b border-neutral-200">
              <div className="flex-1" />
              
              <div className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-lg font-semibold text-black shadow-sm">
                <span className='text-sm'>
                  {user?.username || 'User'}
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonPopoverCard: {
                        transform: 'translateY(3.5vh)',
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-gray-100">
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-3 ${
                          message.sender === 'user'
                            ? 'bg-black text-white'
                            : 'bg-gray-50 text-black border border-gray-200'
                        }`}
                        style={message.sender === 'bot' ? { maxHeight: '40vh', overflow: 'auto' } : {}}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                          {message.sender === 'bot' && isTyping && message.id === messages[messages.length - 1]?.id && (
                            <span className="animate-pulse">|</span>
                          )}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-gray-300' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && <TypingIndicator />}
                </div>
              </div>

              <div className="px-4 py-4 bg-gray-100 ">
                <div className="max-w-4xl mx-auto">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4">
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Upload preview" 
                          className="max-w-xs max-h-32 rounded-lg border-2 border-gray-300"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Language Selection */}
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <button
                      onClick={() => handleLanguageSwitch('en')}
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                        currentLanguage === 'en' 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageSwitch('hi')}
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${
                        currentLanguage === 'hi' 
                          ? 'bg-black text-white' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleImageUpload}
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl border bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-black shadow-sm hover:shadow-md transition-all duration-300 ${
                        selectedImage ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2z" />
                      </svg>
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about your crops..."
                        className="w-full h-12 px-6 bg-white border-2 border-gray-200 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-black transition-all duration-300"
                        disabled={isLoading || isTyping}
                      />
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!hasContent || isLoading || isTyping}
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
                        hasContent && !isLoading && !isTyping
                          ? 'bg-black text-white hover:bg-gray-800 scale-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed scale-95'
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

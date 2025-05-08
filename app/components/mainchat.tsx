"use client"

import NavbarMain from '@/components/navbar-main'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Pencil, FolderClosed, X, Check } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from "framer-motion"
import DocumentFile from './documentViewer'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { savedDataDbType } from '../../types'
import { toast } from 'sonner'
import Chats from './chats'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ChatMobile from './chatMobile'
import '@/styles/main.css'
import { changeName } from '@/actions/projects'

const menuVariants = {
  clicked: { opacity: 1, x: -6, },
  notclicked: { opacity: 0, x: "-100%",}
}

export default function Main({ data }: { data: savedDataDbType}) {
  const [menuClick, setMenuClick] = useState<boolean>(false);
  const [chatClick, setChatClick] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null!);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);


 //FOR UPDATING NAME
  const {mutate, isPending } = useMutation({
    mutationFn: (formdata: FormData) => changeName(formdata),
    onSuccess: (res) =>  {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    }
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setEditing(false);
    }
  };

  // Attach click event listener to detect clicks outside the input field
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  function handleMenuClick() {
    setMenuClick(prev => !prev)
    
    if(menuClick && chatClick) {
      setChatClick(false);
    }
 }

 function handleChangeName(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); // Prevent the default form submission behavior

  console.log("Form submitted"); // Debugging statement to check if function is called

  

  const formdata = new FormData();
  formdata.append('id', data.id);
  formdata.append('newName', newName);

  mutate(formdata, {
    onSuccess: (res) => {
      toast.success("Updated document name");
      console.log("RES: ", res);
      setEditing(false);
      router.refresh();
    }, 
    onError: (err) => {
      toast.error("Error updating document name: " + err.message);
    }
  });
}

  function formatName (e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    const formattedValue = value.replace(/[^a-zA-Z_\-]/g, '');
    setNewName(formattedValue);
  } 


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full min-h-screen min-w-full bg-orange-200 h-screen overflow-x-hidden overflow-y-hidden">
      <main className="flex w-full flex-row justify-center h-full">
        {/**DOCUMENT FILE */}
        <div
          className="px-6 py-4 w-auto grow-7 h-full"
        >
          {/**MAP THE DOCUMENTS HERE */}
          <DocumentFile selectedFile={data.file_link} />
        </div>


        {/**FOR MOBILE DISPLAY CHAT */}
      <div className="bottom-5 md:hidden fixed right-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className={`w-16 ${
            isOpen ? "hidden" : "block"
          } h-16 bg-white text-white
                rounded-full flex items-center justify-center 
                border-violet-500 border hover:bg-violet-500 focus:outline-none`}
        >
          <Image
            src={"/chat-icon.svg"}
            alt="chat icon"
            width={50}
            height={50}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ width: 0, height: 0 }}
              animate={{ width: 280, height: 550 }}
              exit={{ width: 0, height: 0 }}
              className="bg-[#f8f6fa] rounded-lg flex flex-col justify-between lg:hidden
                  shadow-lg border border-[#C0BCD1] absolute 
                bottom-0 right-0 z-20 h-full overflow-hidden"
            >
              <div className="flex h-[60px] justify-between items-center px-4 py-2 bg-violet-500 text-white">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.972 5.972 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.48 2.091 14.487 2.091 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                    />
                  </svg>
                  <span className="text-lg">Chat</span>
                </div>
                <button
                  onClick={toggleChat}
                  className="text-white hover:text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/*  Add your chat messages or components here  <ChatMobile fileKey={data?.file_key} id={data?.id} /> */}
                <Chats fileKey={data?.file_key} id={data?.id}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/**CHAT BOX */}
        <div className="border-[#A782F5] bg-violet-500 hidden md:flex flex-col border 
          grow-3 w-1/4 h-full">
          {/**TOP */}
          <div className="flex gap-2 text-primaryColor w-auto z-50 items-center m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.972 5.972 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.48 2.091 14.487 2.091 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <span className="text-[20px]">Chat</span>
          </div>

          {/**CHAT COMPLETION  */}
          <Chats fileKey={data?.file_key} id={data?.id} />
        </div>
      </main>
    </div>
  );
}
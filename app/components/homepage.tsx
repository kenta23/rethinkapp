'use client'

import Navbar from "@/components/Navbar";
import Image from 'next/image'
import React, { useEffect, useRef } from "react";
import { CheckCircle2 } from 'lucide-react';
import { motion, useScroll, m, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer';
import Hero from "@/components/Hero";
import StickyNavbar from "./StickyNavbar";
import { auth } from "../../auth";
import { useSession } from "next-auth/react";


const purpose = [
  {
    id: 1,
    title: 'For Students',
  },
  {
    id: 2,
    title: 'For Researchers'
  },
  {
    id: 3,
    title: 'For Professionals'
  }
]

const itemVariants = {
    onview: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    offview: {
      y: 250,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
};
const features = [
  {
    icon: 
     <CheckCircle2 
         color="white"
         size={32}
         className="bg-secondaryColor text-md  rounded-full"
     />,
    title: 'View and analyze ',
    description: 'By your pdf files, you can view, ask, and share some idea',
    image: '/pdf-icon.png',
    alt: 'pdf icon'

  },
  {
    icon: 
     <CheckCircle2 
         color="white"
         size={32}
         className="bg-secondaryColor text-md rounded-full"
     />,
    title: 'Intuitive UI',
    description: `Designed a clean and intuitive UI 
      with easy-to-understand controls.`,
    image: '/ui.svg',
    alt: 'ui.svg'
  },
  {
    icon: 
     <CheckCircle2 
         color="white"
         size={32}
         className="bg-secondaryColor text-md  rounded-full"
     />,
    title: 'Chat System',
    description: 'AI-powered Chat for faster and smarter communication',
    image: '/bot.svg',
    alt: 'bot.svg'

  },
  {
    icon: 
     <CheckCircle2 
         color="white"
         size={32}
         className="bg-secondaryColor text-md  rounded-full"
     />,
    title: 'User Friendly',
    description: 'Simplify and streamline for a hassle-free experience.',
    image: '/userfriendly.svg',
    alt: 'userfriendly.svg'
  },
]


const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, } = useScroll({
    target: scrollRef,
    offset: ["0 1", "1.33 1"]
  });

  const session = useSession();

  console.log(session);

  const [ref, inView] = useInView({
    threshold: 0,
  });


  /**LANDING PAGE */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", type: "tween" }}
      className="relative min-h-full overflow-y-clip"
    >
      <StickyNavbar inView={inView} />

      <main className="w-full bg-white dark:bg-[#0e0c0f] z-10 px-2 sm:px-8 md:px-[80px] py-4 lg:px-[90px] min-w-full h-auto min-h-full relative">
        <div className="">
          <div ref={ref}>
            <Navbar />
          </div>

          {/**HERO SECTION */}
          <Hero />

          <div
            className="w-full absolute top-0 left-0 
           h-[320px] 
           sm:h-[430px]
           md:h-[530px]
           lg:h-[570px] 
           bg-blend-darken
           bg-gradient-to-br from-[#4d7cb1] 
           via-[#6654ad]
           to-[#4D3FA3] 
           flex items-center -z-10 justify-center"
          ></div>
        </div>

        {/**VIDEO DEMO */}
        <div className="w-full flex-col rounded-lg gap-6 lg:flex-row md:gap-2 px-12 justify-around mt-14 sm:mt-28 h-auto py-6 flex items-center ">
          <div className="max-w-[320px]">
            <h1 className="text-[#1e1e30] dark:text-white leading-normal font-normal text-[25px] sm:text-[40px]">
              Discover How It Works
            </h1>
            <p className="font-light text-sm md:text-[18px] text-black dark:text-white">
              See how easy it is to upload document files and interact
              seamlessly with our AI. Watch the demo now!
            </p>
          </div>
          <video
            width={580}
            height={850}
            autoPlay
            controls
            muted
            className="shadow-md border border-gray-100 h-[400px]"
          >
            <source src={"https://hl1femsdux.ufs.sh/f/botOgo9j3m8OK0pLQKm8e5qrik0xXW2LtoawGRMy4czIFZUd"} type="video/webm"/>
               Your browser does not support the video.
          </video>
        </div>

        {/**SECOND CONTENT */}
        <motion.div
          ref={scrollRef}
          style={{
            opacity: scrollYProgress,
          }}
          transition={{ ease: "linear", delay: 1 }}
          className="w-full mt-[40px] md:mt-[70px]  
           h-[240px] md:h-[270px] justify-center items-center flex mb-4"
        >
          <div className="flex justify-evenly w-full items-center">
            <Image
              width={170}
              height={170}
              src={"/chatbot.svg"}
              alt="chatbot png"
              className="w-[140px] md:w-[190px] lg:w-[230px]"
            />

            <div className="h-auto w-[45%]">
              <p className="text-center sm:text-[25px] md:text-[30px] text-md leading-normal bg-gradient-to-r from-blue-600 via-pink-500 to-[#6a57e6] text-transparent bg-clip-text">
                Working with AI to enhance your prompts and for accurate
                results.
              </p>
            </div>
          </div>
        </motion.div>

        {/**THIRD CONTENT*/}
        <div className="w-full mt-[20px] lg:mt-[50px] rounded-lg">
          <section className="py-[35px] px-[25px] flex flex-col items-center gap-4">
            <div className="inline-flex items-start sm:items-center flex-col gap-4 h-auto">
              <AnimatePresence>
                <motion.h1
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1.1 }}
                  viewport={{ once: true }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring" }}
                  className="text-[#1e1e30] dark:text-white leading-normal sm:leading-[70px] font-normal text-[35px] sm:text-[50px]"
                >
                  See features in action
                </motion.h1>
              </AnimatePresence>

              <motion.p
                initial={{ scale: 0 }}
                viewport={{ once: true }}
                whileInView={{ scale: 1.1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring" }}
                className="text-[17px] text-black dark:text-white text-wrap md:text-[25px]"
              >
                Discover exclusive features on our site
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[20px] lg:mt-[65px] items-center w-full">
              {features.map((item, index) => (
                <motion.div
                  initial={"offview"}
                  whileInView={"onview"}
                  variants={itemVariants}
                  viewport={{ once: true }}
                  key={index}
                  className="w-auto shadow-xs justify-center border-b border-rose-200 rounded-lg flex items-center py-2 px-4 h-[150px]  "
                >
                  <div className="flex items-start min-w-[250px] max-w-[400px] gap-4 ">
                    <Image
                      src={item.image}
                      width={50}
                      className=""
                      height={50}
                      alt={item.alt}
                    />

                    <div className="flex text-start flex-col gap-4">
                      <h2 className="text-[20px] text-[#381E6F] dark:text-[#a493ca] md:text-sm lg:text-xl font-normal">
                        {item.title}
                      </h2>
                      <p className="text-sm font-light md:text-xs lg:text-[14px] text-black dark:text-white text-pretty">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="w-full h-auto my-[15px] md:my-[50px] lg:my-[60px]">
          <div className="flex justify-evenly  items-center">
            {purpose.map((item) => (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring" }}
                key={item.id}
                className="flex items-center gap-3"
              >
                <CheckCircle2
                  className="text-blue-400 size-[12px] sm:size-[15px] md:size-[20px] lg:size[25px] text-md rounded-full"
                />
                <p className="text-black dark:text-white font-medium text-xs sm:text-sm md:text-lg text-secondaryColor">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <div className="w-full md:px-4 py-12 mt-2 lg:mt-12 flex mx-auto justify-center items-center ">
        <div className="flex w-auto items-center space-x-[55px] md:space-x-[120px]">
          <Image
            src={"/laptop-3d.svg"}
            height={260}
            width={260}
            alt="laptop-3d.svg"
            className="w-[170px] md:w-[260px] select-none"
          />

          <h1 className="text-white font-normal text-[22px] md:text-[27px] lg:text-[37px] ">
            Read, Search, Interact
          </h1>
        </div>


              {/**CIRCLE BACKGROUND */}
      <div className="absolute bottom-[-200px] blur-sm bg-blend-soft-light w-full max-w-full h-[1350px] rounded-t-[600px] -z-20  bg-gradient-to-b from-[#F9EDF8] via-[#96A4EE] to-[#804da7] opacity-[45%]" />
      <div className="absolute bottom-[-200px] blur-md bg-blend-soft-light w-full max-w-full h-[1250px] rounded-t-[600px] -z-20 bg-gradient-to-b from-[#F9EDF8] via-[#96A4EE] to-[#804da7] opacity-[50%]" />
      <div className="absolute bottom-[-200px] blur-lg bg-blend-light w-full max-w-full h-[1160px] rounded-t-[600px]  -z-20 bg-gradient-to-b from-[#F9EDF8] via-[#96A4EE] to-[#804da7] opacity-[60%]" />
      <div className="absolute bottom-[-200px] blur-xl bg-blend-light w-full max-w-full h-[860px] rounded-t-[600px] -z-20 bg-gradient-to-b from-[#F9EDF8] via-[#96A4EE] to-[#804da7] opacity-[70%]" />

      
      </div>


    </motion.div>
  );
};

export default Home;
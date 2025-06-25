"use client";

import {
  ScanEye,
  Glasses,
  Zap,
  ShieldCheck,
  Fingerprint,
  EyeOff,
  Drama,
  Users,
  AudioWaveform,
  AlarmClockCheck,
  TextSelect,
  Lock,
  LockOpen,
} from "lucide-react";

import { useState, useEffect } from "react";

const AnimatedLock = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev);
    }, 2000); // Toggle every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div
        className={`absolute transition-all duration-500 ${isLocked ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        <Lock className="w-7 h-7 text-purple-600" strokeWidth={1.5} />
      </div>
      <div
        className={`absolute transition-all duration-500 ${isLocked ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
      >
        <LockOpen className="w-7 h-7 text-purple-600" strokeWidth={1.5} />
      </div>

      {/* Optional pulse circle */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-gradient-to-r from-purple-600 via-pink-500 to-orange-400 transition-all duration-700 ${isLocked ? "scale-100 opacity-30" : "scale-75 opacity-0"}`}
        style={{
          borderImage:
            "linear-gradient(to right, rgb(147 51 234), rgb(236 72 153), rgb(251 146 60)) 1",
        }}
      ></div>
    </div>
  );
};

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            One Dashboard. Total Control.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CreatorsLyst replaces messy inboxes, spreadsheets, and missed
            opportunities with one streamlined dashboard — so effortless, you'll
            never want to manage deals any other way
          </p>
        </div>

        <div className="flex flex-col gap-16 max-w-5xl mx-auto">
          {[
            {
              icon: <Zap className="w-8 h-8 text-purple-600" />,
              title: "Smart Scanning",
              description: [
                {
                  text: "Automatically identifies brand deals from your inbox or DMs",
                  icon: <Glasses className="w-5 h-5 text-purple-600 mt-1" />,
                },
                {
                  text: "Pulls out the important details, like brand name and payment",
                  icon: <ScanEye className="w-5 h-5 text-purple-600 mt-1" />,
                },
              ],
            },
            {
              icon: <AnimatedLock />,
              title: "Secure Integration",
              description: [
                {
                  text: "No passwords shared — just simple, secure logins",
                  icon: (
                    <Fingerprint className="w-5 h-5 text-purple-600 mt-1" />
                  ),
                },
                {
                  text: "Your info stays private and protected at all times",
                  icon: <EyeOff className="w-5 h-5 text-purple-600 mt-1" />,
                },
                {
                  text: "You choose what to connect and what to keep separate",
                  icon: <Drama className="w-5 h-5 text-purple-600 mt-1" />,
                },
              ],
            },
            {
              icon: <Users className="w-8 h-8 text-purple-600" />,
              title: "Deal Dashboard",
              description: [
                {
                  text: "Track deal status — from first message to final payment",
                  icon: (
                    <AudioWaveform className="w-5 h-5 text-purple-600 mt-1" />
                  ),
                },
                {
                  text: "Stay on top of deadlines and deliverables",
                  icon: (
                    <AlarmClockCheck className="w-5 h-5 text-purple-600 mt-1" />
                  ),
                },
                {
                  text: "No more messy spreadsheets or lost emails",
                  icon: <TextSelect className="w-5 h-5 text-purple-600 mt-1" />,
                },
              ],
            },
          ].map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex items-center gap-8 ${
                  isEven ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Animated wrapper only for first card */}
                {index === 0 ? (
                  <div className="animated-gradient-wrapper">
                    <div className="relative z-10 w-[200px] h-[200px] flex items-center justify-center rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
                      <div className="text-purple-600">{feature.icon}</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow flex-shrink-0 relative z-10">
                    <div className="text-purple-600">{feature.icon}</div>
                  </div>
                )}

                {/* Text content */}
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  {feature.description.map((line, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      {line.icon}
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {line.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

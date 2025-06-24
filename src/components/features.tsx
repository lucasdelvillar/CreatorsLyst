import { ArrowUpRight, CheckCircle2, Zap, Shield, Users } from "lucide-react";

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

        <div className="flex flex-col gap-16 max-w-4xl mx-auto">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Smart Scanning",
              description: [
                "Automatically identifies brand deals from your inbox or DMs",
                "Pulls out the important details, like brand name and payment",
                "No more digging through cluttered inboxes",
              ],
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Secure Integration",
              description: [
                "No passwords shared — just simple, secure logins",
                "Your info stays private and protected at all times",
                "You choose what to connect and what to keep separate",
              ],
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Deal Dashboard",
              description: [
                "Track deal status — from first message to final payment",
                "Stay on top of deadlines and deliverables",
                "No more messy spreadsheets or lost emails",
              ],
            },
          ].map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex items-center gap-8 ${isEven ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Icon card */}
                <div className="w-[200px] h-[200px] flex items-center justify-center bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow flex-shrink-0">
                  <div className="text-purple-600">{feature.icon}</div>
                </div>

                {/* Text content */}
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description[0]}
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description[1]}
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description[2]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

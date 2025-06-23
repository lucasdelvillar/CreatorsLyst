import { ArrowUpRight, CheckCircle2, Zap, Shield, Users } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            One Dashboard. Total Control. No Looking Back.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CreatorsLyst replaces messy inboxes, spreadsheets, and missed
            opportunities with one streamlined dashboard — so effortless, you'll
            never want to manage deals any other way
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Smart Scanning",
              description:
                "Automatically identifies brand deal emails from your inbox",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Secure Integration",
              description:
                "Safe email & social media connection with enterprise security",
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Deal Dashboard",
              description:
                "Organize deals by brand, amount, deadline, and status",
            },
            {
              icon: <CheckCircle2 className="w-6 h-6" />,
              title: "Quick Actions",
              description: "Respond, archive, or flag deals with one click",
            },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              {/* Card with icon */}
              <div className="w-[200px] h-[200px] flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600">{feature.icon}</div>
              </div>

              {/* Text below the card */}
              <div className="text-center max-w-[200px]">
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

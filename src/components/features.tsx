import { ArrowUpRight, CheckCircle2, Zap, Shield, Users } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-[#fffcfdb3]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Manage Brand Deals
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From email integration to deal tracking, we've got every aspect of
            brand collaboration covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Smart Email Scanning",
              description:
                "Automatically identifies brand deal emails from your inbox",
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Secure Integration",
              description:
                "Safe Gmail & Outlook connection with enterprise security",
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
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

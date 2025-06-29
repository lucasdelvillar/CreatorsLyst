import Link from "next/link";
import { ArrowUpRight, Check, Mail, Inbox, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0" />

      <div className="relative pt-16 pb-4 sm:pt-16 sm:pb-4">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-full text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                <Mail className="w-4 h-4 text-purple-600" />
                <span>Brand Deal Management Made Simple</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Never Miss a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                Brand Deal
              </span>{" "}
              Again
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Automatically organize and manage brand collaboration
              opportunities from your inbox or DMs. Turn chaos into opportunity
              with smart categorization and deal tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/*<Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Start Organizing Deals
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>*/}

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-lg hover:brightness-95 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Email & Socials </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Smart deal categorization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Real-time analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

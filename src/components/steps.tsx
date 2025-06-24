export default function Steps() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 flex flex-col">
          <h2 className="text-3xl font-bold">Brand deals done</h2>
          <h2 className="text-3xl font-bold mb-4">the creator way</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {[
            {
              step: "Step 1",
              title: "Connect",
              description:
                "Securely link your email or social media account in just a few clicks.",
            },
            {
              step: "Step 2",
              title: "Organize",
              description:
                "Our smart system identifies and categorizes brand deal opportunities.",
            },
            {
              step: "Step 3",
              title: "Track",
              description:
                "View, respond to, and track all your deals from one dashboard.",
            },
          ].map((item, index) => {
            const backgroundImage =
              index === 0
                ? "url('/images/connect.jpg')"
                : index === 1
                  ? "url('/images/organize.jpg')"
                  : index === 2
                    ? "url('/images/track.jpg')"
                    : "";

            const isImageCard = index <= 2;
            const isThirdCard = index === 2;

            return (
              <div
                key={index}
                className={`
          relative w-[355px] h-[440px] flex flex-col justify-between rounded-xl shadow-sm hover:shadow-md transition-shadow text-left hover:scale-[1.03] hover:-translate-y-1 transition-transform duration-300 ease-out
          ${isImageCard ? "text-white bg-cover bg-center" : "bg-white"}
        `}
                style={isImageCard ? { backgroundImage } : {}}
              >
                {isThirdCard && (
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl z-0" />
                )}

                <div className="relative z-10 mt-auto p-6">
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isImageCard ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={isImageCard ? "text-white/80" : "text-gray-600"}
                  >
                    {item.description}
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

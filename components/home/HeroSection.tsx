import React from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Campus */}
      <div className="absolute inset-0">
        <img
          src="/images/campus.jpg"
          alt="FPT University Campus"
          className="w-full h-full object-cover"
        />
        {/* White gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />
      </div>

      <div className="relative flex flex-col items-center w-full max-w-7xl mx-auto gap-5 mt-[40px]">
        {/* First row */}
        <div className="grid grid-cols-2 items-center gap-8">
          <img
            src="/images/campus2.jpg"
            alt="FPT Campus"
            className="h-[350px] w-[850px] object-cover rounded-2xl shadow-xl border-2 border-white"
          />

          <div className="flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Connect with
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-5xl md:text-7xl font-extrabold">
                FPT Alumni
              </div>
            </h1>
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-2 items-center gap-8">
          {/* Left: Text */}
          <div className="mt-6 p-6 max-w-3xl text-left">
            <p className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Together we are stronger
              </span>{" "}
              — join a vibrant community of FPT alumni shaping the future across
              industries and borders.
            </p>
            <p className="mt-4 text-lg md:text-xl text-gray-700 leading-relaxed">
              From{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent font-semibold">
                classrooms to careers
              </span>
              , the FPT Alumni Network keeps us united, inspired, and moving
              forward together.
            </p>
          </div>

          {/* Right: Students Image */}
          <img
            src="/images/students2.jpg"
            alt="FPT Students"
            className="h-[350px] w-[700px] object-cover rounded-2xl shadow-xl border-2 border-white"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

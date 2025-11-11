import React from "react";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="flex flex-col w-full items-start relative bg-[#b2ffb8]">
      <div className="flex items-center gap-[72.39px] px-[100.23px] py-[66.82px] relative w-full bg-[#b2ffb8]">
        <div className="flex flex-col items-start gap-[22.27px] relative flex-1">
          <div className="flex flex-col items-start gap-[11.14px] relative">
            <h1 className="relative [font-family:'Inter',Helvetica] font-normal text-[64px] tracking-[0] leading-[52.9px]">
              <span className="text-[#263238]">Home</span>
              <span className="text-[#4caf4f]">Stock</span>
            </h1>

            <p className="relative [font-family:'Inter',Helvetica] font-normal text-[#263238] text-sm tracking-[0] leading-[16.7px]">
              Optimiza el inventario de tu hogar, Evita compras duplicadas y
              reduce el desperdicio. Controla fechas de vencimiento y comparte
              el inventario con tu familia.
            </p>
          </div>
        </div>

        <img
          className="relative w-[272.16px] h-[283.3px]"
          alt="Illustration"
          src="/illustration.svg"
        />
      </div>
    </section>
  );
};

import React from "react";
import { Button } from "../../../../components/ui/button";

const navigationItems = [
  { label: "Inicio", width: "w-[71px]" },
  { label: "GrupoFamiliar", width: "w-fit" },
  { label: "Ubicaciones", width: "w-fit" },
  { label: "Lista de compra", width: "w-fit" },
  { label: "Reportes", width: "w-fit" },
];

export const NavigationHeaderSection = (): JSX.Element => {
  return (
    <header className="flex w-full items-center justify-center gap-[43.85px] px-[100.23px] py-[11.14px] bg-neutralwhite shadow-[0px_2.78px_5.57px_#abbed166]">
      <nav className="flex items-center justify-center gap-[21px]">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            className="inline-flex items-center gap-[5.57px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              className={`relative ${item.width} mt-[-0.70px] [font-family:'Inter',Helvetica] font-bold text-neutral-700 text-xs ${index === 0 ? "text-center" : ""} tracking-[0] leading-[16.7px] whitespace-nowrap`}
            >
              {item.label}
            </div>
          </button>
        ))}
      </nav>

      <Button className="flex items-center justify-center gap-[5.57px] px-[22.27px] py-[9.74px] h-auto bg-[#00c50f] hover:bg-[#00b00d] rounded-[2.78px] border border-solid border-[#868686] shadow-[0px_4px_4px_#00000040]">
        <span className="[font-family:'Inter',Helvetica] font-bold text-neutralwhite text-xs text-center tracking-[0] leading-[16.7px] whitespace-nowrap">
          Sign up / Log in
        </span>
      </Button>
    </header>
  );
};

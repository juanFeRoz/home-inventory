import { SendIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

const socialIcons = [
  { src: "/social-icons-1.svg", alt: "Social icon 1" },
  { src: "/social-icons.svg", alt: "Social icon 2" },
  { src: "/social-icons-2.svg", alt: "Social icon 3" },
  { src: "/social-icons-3.svg", alt: "Social icon 4" },
];

const companyLinks = [
  "About us",
  "Blog",
  "Contact us",
  "Pricing",
  "Testimonials",
];

const supportLinks = [
  "Help center",
  "Terms of service",
  "Legal",
  "Privacy policy",
  "Status",
];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="w-full bg-[#e8f5e9] py-[44.55px] px-[114.85px]">
      <div className="flex items-start gap-[87.01px]">
        <div className="flex flex-col items-start gap-[41px]">
          <div className="flex flex-col items-start gap-[5.57px]">
            <div className="[font-family:'Inter',Helvetica] font-normal text-4xl tracking-[0] leading-[13.9px]">
              <span className="text-[#00c50f]">HomeStock</span>
            </div>

            <div className="mt-[20px] [font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] tracking-[0] leading-[13.9px]">
              Copyright © 2020 Landify UI Kit.
            </div>

            <div className="[font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] tracking-[0] leading-[13.9px]">
              All rights reserved
            </div>
          </div>

          <div className="flex items-start gap-[11.14px]">
            {socialIcons.map((icon, index) => (
              <img
                key={index}
                className="w-[22.27px] h-[22.27px]"
                alt={icon.alt}
                src={icon.src}
              />
            ))}
          </div>
        </div>

        <div className="flex items-start gap-[20.88px]">
          <div className="flex flex-col items-start gap-[16.71px]">
            <div className="[font-family:'Inter',Helvetica] font-normal text-[#263238] text-[13.9px] tracking-[0] leading-[19.5px]">
              Company
            </div>

            <div className="flex flex-col items-start gap-[8.35px]">
              {companyLinks.map((link, index) => (
                <div
                  key={index}
                  className="[font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] tracking-[0] leading-[13.9px] cursor-pointer hover:underline"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-[16.71px]">
            <div className="[font-family:'Inter',Helvetica] font-normal text-[#263238] text-[13.9px] tracking-[0] leading-[19.5px]">
              Support
            </div>

            <div className="flex flex-col items-start gap-[8.35px]">
              {supportLinks.map((link, index) => (
                <div
                  key={index}
                  className="[font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] tracking-[0] leading-[13.9px] cursor-pointer hover:underline"
                >
                  {link}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-[16.71px]">
            <div className="[font-family:'Inter',Helvetica] font-normal text-[#263238] text-[13.9px] tracking-[0] leading-[19.5px]">
              Stay up to date
            </div>

            <div className="relative w-[179.5px]">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-[27.84px] bg-[#263238] bg-opacity-20 border-0 rounded-[5.57px] [font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] pr-[30px]"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-[8px] top-1/2 -translate-y-1/2 h-auto w-auto p-0 hover:bg-transparent"
              >
                <SendIcon className="w-[12.5px] h-[12.5px] text-[#263238]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

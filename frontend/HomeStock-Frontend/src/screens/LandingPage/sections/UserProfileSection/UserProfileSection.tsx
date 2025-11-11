import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  {
    icon: "/icon.svg",
    title: "Crea tu grupo familiar",
    description:
      "Añade a los integrantes de tu familia para manejar juntos el inventario de tu hogar y las ubicaciones donde decidan almacenar el inventario.",
    hasCustomIcon: true,
  },
  {
    icon: null,
    title: "Crea tus ubicaciones",
    description:
      "Crea ubicaciones con tu grupo familiar para gestionar el tipo de productos que almacenar y optimiza tu gestión.",
    hasCustomIcon: false,
  },
  {
    icon: null,
    title: "Clasifica tus productos",
    description:
      'Clasifica tus productos según su utilidad, mejora la facilidad de búsqueda y el control dentro de tu inventario."',
    hasCustomIcon: false,
  },
];

export const UserProfileSection = (): JSX.Element => {
  return (
    <section className="w-full flex flex-col items-center gap-[11.14px] bg-white py-8">
      <div className="flex flex-col w-full max-w-[1002.34px] items-center gap-[5.57px]">
        <h2 className="w-full max-w-[377.27px] [font-family:'Inter',Helvetica] font-normal text-neutraldgrey text-[25.1px] text-center tracking-[0] leading-[30.6px]">
          Administra el inventario de tu hogar en un solo lugar
        </h2>

        <p className="w-full [font-family:'Inter',Helvetica] font-normal text-neutralgrey text-[11.1px] text-center tracking-[0] leading-[16.7px]">
          Que puedes hacer con HomeStock?
        </p>
      </div>

      <div className="flex w-full max-w-[1002.34px] items-center justify-center gap-6 px-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="flex flex-col w-52 h-[230px] bg-[#e8f5e9] rounded-[5.57px] shadow-[0px_1.39px_2.78px_#abbed133] border-0"
          >
            <CardContent className="flex flex-col items-center gap-[5.57px] px-[22.27px] py-[16.71px] h-full">
              <div className="flex flex-col w-full items-center gap-[11.14px]">
                {feature.hasCustomIcon ? (
                  <img
                    className="w-[50.24px] h-[44.98px]"
                    alt="Icon"
                    src={feature.icon}
                  />
                ) : (
                  <div className="w-[45.24px] h-[38.98px] relative">
                    <div className="absolute top-[5px] left-5 w-[35px] h-[34px] bg-[#b2ffb8] rounded-[12.53px_3.48px_6.96px_3.48px] -rotate-180" />
                  </div>
                )}

                <h3 className="w-full [font-family:'Inter',Helvetica] font-bold text-neutraldgrey text-[19.5px] text-center tracking-[0] leading-[25.1px]">
                  {feature.title}
                </h3>
              </div>

              <p className="w-full [font-family:'Inter',Helvetica] font-normal text-[#263238] text-[9.7px] text-center tracking-[0] leading-[13.9px]">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

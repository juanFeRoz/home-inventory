import React from "react";
import { Button } from "../../../../components/ui/button";

export const InventoryManagementSection = (): JSX.Element => {
  return (
    <section className="w-full bg-white">
      <div className="w-full bg-[#d9d9d9]">
        <div className="flex items-center justify-between px-[100.23px] py-0 bg-[#263238]">
          <img
            className="w-[307.66px] h-[301.4px]"
            alt="Frame"
            src="/frame-35.svg"
          />

          <div className="flex flex-col w-[460.1px] items-start gap-[22.27px]">
            <div className="flex flex-col w-[418.34px] items-start gap-[11.14px]">
              <h2 className="self-stretch [font-family:'Inter',Helvetica] font-normal text-white text-[32px] tracking-[0] leading-[30.6px]">
                Construye tu perfil !
              </h2>

              <p className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#d9d9d9] text-xs tracking-[0] leading-[13.9px]">
                Con tu perfil de HomeStock puedes organizar completamente el
                inventario de tu hogar, recibir alertas automáticas antes de que
                los productos venzan y generar listas de compras inteligentes
                basadas en lo que realmente necesitas. Comparte el acceso con
                toda tu familia para que todos sepan qué hay disponible en la
                despensa, nevera o cualquier ubicación que definas. Evita
                compras duplicadas, reduce el desperdicio de alimentos y mantén
                tu hogar siempre bien abastecido de manera eficiente.
              </p>
            </div>

            <Button className="h-auto inline-flex items-center justify-center gap-[6.96px] px-[22.27px] py-[9.74px] bg-[#00c50f] hover:bg-[#00b00d] rounded-[2.78px]">
              <span className="[font-family:'Inter',Helvetica] font-medium text-neutralwhite text-sm text-center tracking-[0] leading-[16.7px] whitespace-nowrap">
                Perfil
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

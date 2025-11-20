import React from 'react';
import { ProductoLista } from '../../types/listaCompra';
import { Button } from '../ui/button';
import { CheckCircle, Square, Trash2 } from 'lucide-react';

interface Props {
  producto: ProductoLista;
  onEliminar: () => void;
  onToggle: (comprado: boolean) => void;
  disabled?: boolean;
}

const ProductoItem: React.FC<Props> = ({ producto, onEliminar, onToggle, disabled = false }) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(!producto.comprado)}
          className="flex items-center gap-2"
          disabled={disabled}
        >
          {producto.comprado ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <div>
          <div className={`font-medium ${producto.comprado ? 'line-through text-gray-500' : ''}`}>{producto.nombre}</div>
          <div className="text-sm">
            {producto.cantidad ? (
              <span className="text-gray-500 mr-4">
                <span className="text-blue-600 font-medium">Cantidad: </span>
                <span className="text-gray-500">{producto.cantidad}</span>
              </span>
            ) : null}

            {producto.unidad ? (
              <span className="text-gray-500">
                <span className="text-blue-600 font-medium">Unidad: </span>
                <span className="text-gray-500">{producto.unidad}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <Button
          onClick={onEliminar}
          type="button"
          variant="outline"
          size="lg"
          className="p-3 h-10 w-10 flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50"
          title={`Eliminar ${producto.nombre}`}
          aria-label={`Eliminar ${producto.nombre}`}
          disabled={disabled}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ProductoItem;

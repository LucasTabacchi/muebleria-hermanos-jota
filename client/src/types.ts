export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  medidas?: string;
  materiales?: string;
  imagen: string;
  destacado?: boolean;
}

export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;
}

export type EstadoCarga = "cargando" | "exito" | "error";

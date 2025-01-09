import React, { useState } from "react";
import { Search } from "lucide-react";
import { ProductGrid } from "../components/sales/ProductGrid";
import { Cart } from "../components/sales/Cart";
import { Product, SaleItem } from "../types";

// Dados mockados para exemplo
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Arroz Integral",
    price: 8.9,
    stock: 50,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Feijão Carioca",
    price: 7.5,
    stock: 30,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Coca-Cola 2L",
    price: 9.9,
    stock: 24,
    unit: "unit",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Sales() {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const handleProductSelect = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          unit: product.unit,
          total: product.price,
        },
      ]);
    }
    // Em dispositivos móveis, mostra o carrinho após adicionar um item
    if (window.innerWidth < 768) {
      setShowCart(true);
    }
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCartItems(
      cartItems.map((item, i) =>
        i === index ? { ...item, quantity, total: quantity * item.price } : item
      )
    );
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6">
      {/* Produtos e Pesquisa */}
      <div className={`flex-1 ${showCart ? "hidden" : "block"} md:block`}>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
            Código de Barras
          </button>
        </div>

        <ProductGrid
          products={mockProducts.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )}
          onProductSelect={handleProductSelect}
        />
      </div>

      {/* Carrinho */}
      <div className={`${showCart ? "block" : "hidden"} md:block md:w-96`}>
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
        {/* Botão Voltar para Mobile */}
        <button
          onClick={() => setShowCart(false)}
          className="mt-4 w-full py-2 bg-gray-100 rounded-lg text-gray-600 md:hidden"
        >
          Voltar para Produtos
        </button>
      </div>
    </div>
  );
}

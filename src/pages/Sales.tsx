import React, { useState, useEffect } from "react";
import { Search, ShoppingCart as CartIcon } from "lucide-react";
import { ProductGrid } from "../components/sales/ProductGrid";
import { Cart } from "../components/sales/Cart";
import { Product, SaleItem, Payment } from "../types";
import { useProducts } from "../hooks/useProducts";
import { createSale } from "../services/sales";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";

export default function Sales() {
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { products, loading, error: productsError } = useProducts();

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleProductSelect = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      // Verifica se há estoque suficiente
      const totalQuantity = existingItem.quantity + 1;
      if (totalQuantity > product.stock) {
        setError(`Estoque insuficiente para ${product.name}`);
        return;
      }

      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: totalQuantity,
                total: totalQuantity * item.price,
              }
            : item
        )
      );
    } else {
      if (product.stock < 1) {
        setError(`Estoque insuficiente para ${product.name}`);
        return;
      }

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

    // Limpa mensagem de erro
    setError(null);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    const item = cartItems[index];
    const product = products?.find(p => p.id === item.productId);

    if (product && quantity > product.stock) {
      setError(`Estoque insuficiente para ${product.name}`);
      return;
    }

    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }

    setCartItems(
      cartItems.map((item, i) =>
        i === index ? { ...item, quantity, total: quantity * item.price } : item
      )
    );
    setError(null);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
    setError(null);
  };

  const handleFinalizeSale = async () => {
    if (cartItems.length === 0) {
      setError("Adicione itens ao carrinho para finalizar a venda");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Por enquanto, vamos assumir pagamento em dinheiro
      const total = cartItems.reduce((sum, item) => sum + item.total, 0);
      const payments: Payment[] = [{
        method: "cash",
        amount: total,
        timestamp: new Date()
      }];

      await createSale(cartItems, payments);

      // Limpa o carrinho após a venda
      setCartItems([]);
      setShowCart(false);

    } catch (err) {
      setError("Erro ao processar venda. Tente novamente.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (productsError) {
    return <ErrorMessage message="Erro ao carregar produtos" />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-gray-900">
      {/* Produtos e Pesquisa */}
      <div className={`flex-1 ${showCart ? "hidden" : "block"} md:block overflow-hidden flex flex-col`}>
        <div className="mb-6 flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Botão do carrinho mobile */}
          <button
            onClick={() => setShowCart(true)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg"
          >
            <CartIcon size={20} />
            <span className="font-medium">
              Ver Carrinho ({cartItems.length})
            </span>
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ProductGrid
            products={filteredProducts}
            onProductSelect={handleProductSelect}
          />
        </div>
      </div>

      {/* Carrinho */}
      <div
        className={`w-full md:w-96 ${
          showCart ? "block" : "hidden"
        } md:block h-full bg-white dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent`}
      >
        <div className="flex md:hidden items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Carrinho</h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onFinalize={handleFinalizeSale}
          error={error}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/sales/ProductGrid';
import { Cart } from '../components/sales/Cart';
import { ScaleInput } from '../components/sales/ScaleInput';
import { createSale, getDailySummary } from '../services/sales';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/format';
import { useCartStore, useProductStore, useUIStore } from '../stores';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unit: "kg" | "unit";
  total: number;
}

interface PaymentInput {
  method: "pix" | "cash" | "credit" | "debit";
  amount: number;
}

export default function Sales() {
  const { products, loading } = useProducts();
  const { items, total, addItem, removeItem, updateQuantity } = useCartStore();
  const { setLoading } = useUIStore();
  const [payments, setPayments] = useState<PaymentInput[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [dailySummary, setDailySummary] = useState<any>(null);

  // Carrega o resumo diário ao montar o componente
  React.useEffect(() => {
    loadDailySummary();
  }, []);

  async function loadDailySummary() {
    try {
      const summary = await getDailySummary();
      setDailySummary(summary);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    }
  }

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (product.unit === "unit") {
      // Se for produto por unidade, adiciona direto ao carrinho
      const existingItem = items.find((item) => item.productId === product.id);
      if (existingItem) {
        handleQuantityChange(product.id, existingItem.quantity + 1);
      } else {
        addItem({
          productId,
          quantity: 1,
          price: product.price,
          name: product.name
        });
      }
    } else {
      // Se for produto por peso, seleciona para usar a balança
      setSelectedProduct(productId);
    }
  };

  const handleWeightChange = (weight: number) => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    // Adiciona item ao carrinho
    const existingItem = items.find((item) => item.productId === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + weight);
    } else {
      addItem({
        productId,
        quantity: weight,
        price: product.price,
        name: product.name
      });
    }

    setSelectedProduct(null);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    updateQuantity(product.id, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleAddPayment = (payment: PaymentInput) => {
    setPayments([...payments, payment]);
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleFinalizeSale = async () => {
    try {
      setLoading(true);
      // Verifica se há itens no carrinho
      if (items.length === 0) {
        toast.error('Adicione itens ao carrinho');
        return;
      }

      // Verifica se o total dos pagamentos corresponde ao total da venda
      const saleTotal = items.reduce((sum, item) => sum + item.total, 0);
      const paymentsTotal = payments.reduce((sum, p) => sum + p.amount, 0);

      if (paymentsTotal !== saleTotal) {
        toast.error('Total dos pagamentos não corresponde ao total da venda');
        return;
      }

      // Cria a venda
      await createSale(items, payments);
      
      // Limpa o carrinho e pagamentos
      removeItem();
      setPayments([]);
      
      // Atualiza o resumo diário
      await loadDailySummary();

      toast.success('Venda finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      toast.error('Erro ao finalizar venda');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Implementar lógica de checkout
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Área de produtos */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Balança */}
        {selectedProduct && (
          <ScaleInput
            onWeightChange={handleWeightChange}
            onError={(error) => toast.error(error)}
            productPrice={products.find(p => p.id === selectedProduct)?.price}
          />
        )}

        {/* Grid de produtos */}
        <ProductGrid
          products={products}
          onProductSelect={handleProductSelect}
        />
      </div>

      {/* Carrinho e Resumo */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        <Cart
          items={items}
          payments={payments}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onAddPayment={handleAddPayment}
          onRemovePayment={handleRemovePayment}
          onFinalize={handleFinalizeSale}
        />

        {/* Resumo do dia */}
        {dailySummary && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Resumo do Dia</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Vendas:</span>
                <span>{dailySummary.totalSales}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Valor Total:</span>
                <span>{formatCurrency(dailySummary.totalAmount)}</span>
              </div>
              
              <div className="flex justify-between text-green-500">
                <span>Lucro Bruto:</span>
                <span>{formatCurrency(dailySummary.totalProfit)}</span>
              </div>
              
              <div className="flex justify-between text-red-500">
                <span>Taxas:</span>
                <span>{formatCurrency(dailySummary.totalFees)}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Lucro Líquido:</span>
                <span>{formatCurrency(dailySummary.netProfit)}</span>
              </div>
            </div>

            {/* Resumo por forma de pagamento */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Por Forma de Pagamento:</h3>
              {Object.entries(dailySummary.byPaymentMethod).map(([method, data]: [string, any]) => (
                <div key={method} className="flex justify-between text-sm">
                  <span className="capitalize">{method}:</span>
                  <span>
                    {formatCurrency(data.amount)} 
                    {data.fees > 0 && ` (-${formatCurrency(data.fees)})`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

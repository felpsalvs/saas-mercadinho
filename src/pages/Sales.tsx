import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/sales/ProductGrid';
import { Cart } from '../components/sales/Cart';
import { ScaleInput } from '../components/sales/ScaleInput';
import { createSale, getDailySummary } from '../services/sales';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/format';
import { useCartStore, useProductStore, useUIStore } from '../stores';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { cn } from '../lib/utils';
import { CartItem } from '../types';

interface PaymentInput {
  method: "pix" | "cash" | "credit" | "debit";
  amount: number;
}

export default function Sales() {
  const { products, loading } = useProducts();
  const { items, total, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  const { setLoading } = useUIStore();
  const [payments, setPayments] = useState<PaymentInput[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [dailySummary, setDailySummary] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'products' | 'cart'>('products');

  // Carrega o resumo diário ao montar o componente
  useEffect(() => {
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

  // Configuração dos atalhos de teclado específicos para a página de vendas
  const salesShortcuts = {
    'F6': {
      handler: () => setActiveSection('products'),
      description: 'Focar na lista de produtos',
      scope: 'vendas'
    },
    'F7': {
      handler: () => setActiveSection('cart'),
      description: 'Focar no carrinho',
      scope: 'vendas'
    },
    'F8': {
      handler: () => handleFinalizeSale(),
      description: 'Finalizar venda',
      scope: 'vendas'
    },
    'F9': {
      handler: () => clearCart(),
      description: 'Limpar carrinho',
      scope: 'vendas'
    },
    'CTRL+F': {
      handler: () => {
        // Focar no campo de busca
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Buscar produtos',
      scope: 'vendas'
    },
    'CTRL+P': {
      handler: () => {
        // Simular impressão de recibo
        toast.success('Imprimindo recibo...');
      },
      description: 'Imprimir recibo',
      scope: 'vendas'
    },
  };

  const { getShortcutsList } = useKeyboardShortcuts(salesShortcuts, { scope: 'vendas' });

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
          name: product.name,
          unit: product.unit
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
        productId: product.id,
        quantity: weight,
        price: product.price,
        name: product.name,
        unit: product.unit
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
      const saleTotal = items.reduce((sum, item) => {
        const itemTotal = item.total !== undefined ? item.total : item.price * item.quantity;
        return sum + itemTotal;
      }, 0);
      const paymentsTotal = payments.reduce((sum, p) => sum + p.amount, 0);

      if (paymentsTotal !== saleTotal) {
        toast.error('Total dos pagamentos não corresponde ao total da venda');
        return;
      }

      // Cria a venda
      await createSale(items, payments);
      
      // Limpa o carrinho e pagamentos
      clearCart();
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

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* Barra de atalhos */}
      <div className={cn(
        "bg-surface-light dark:bg-surface-dark",
        "border border-border-light dark:border-border-dark",
        "rounded-lg p-2 mb-2 flex flex-wrap gap-2 text-pdv-xs"
      )}>
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded mr-1">F6</kbd>
          <span>Produtos</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded mr-1">F7</kbd>
          <span>Carrinho</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded mr-1">F8</kbd>
          <span>Finalizar</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded mr-1">F9</kbd>
          <span>Limpar</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded mr-1">Ctrl+F</kbd>
          <span>Buscar</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
          <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded mr-1">Ctrl+P</kbd>
          <span>Imprimir</span>
        </div>
      </div>

      {/* Área de produtos */}
      <div className={cn(
        "flex-1 flex flex-col gap-4",
        activeSection === 'products' ? 'ring-2 ring-primary-500 rounded-lg p-2' : 'p-2'
      )}>
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Carrinho e Resumo */}
      <div className={cn(
        "w-full lg:w-96 flex flex-col gap-4",
        activeSection === 'cart' ? 'ring-2 ring-primary-500 rounded-lg p-2' : 'p-2'
      )}>
        <Cart
          items={items.map(item => ({
            ...item,
            total: item.total !== undefined ? item.total : item.price * item.quantity
          }))}
          payments={payments}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onAddPayment={handleAddPayment}
          onRemovePayment={handleRemovePayment}
          onFinishSale={handleFinalizeSale}
        />

        {/* Resumo do dia */}
        {dailySummary && (
          <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow p-4 border border-border-light dark:border-border-dark">
            <h2 className="text-pdv-lg font-semibold mb-4 text-text-light-primary dark:text-text-dark-primary">
              Resumo do Dia
            </h2>
            
            <div className="space-y-2 text-pdv-base">
              <div className="flex justify-between">
                <span>Total Vendas:</span>
                <span>{dailySummary.totalSales}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Valor Total:</span>
                <span>{formatCurrency(dailySummary.totalAmount)}</span>
              </div>
              
              <div className="flex justify-between text-pdv-success">
                <span>Lucro Bruto:</span>
                <span>{formatCurrency(dailySummary.totalProfit)}</span>
              </div>
              
              <div className="flex justify-between text-pdv-error">
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
              <h3 className="font-medium mb-2 text-pdv-sm">Por Forma de Pagamento:</h3>
              {Object.entries(dailySummary.byPaymentMethod).map(([method, data]: [string, any]) => (
                <div key={method} className="flex justify-between text-pdv-sm">
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

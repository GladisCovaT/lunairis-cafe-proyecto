import { useCallback, useState } from 'react';
import { api } from '../services/api';

// Carga y modifica los datos del panel (resumen, productos, pedidos y mensajes)
export function useAdminData(notify) {
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState(null); // null = todavía cargando
  const [orders, setOrders] = useState(null);
  const [messages, setMessages] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setDashboard(await api('/api/admin/dashboard'));
    } catch (error) {
      notify(error.message);
    }
  }, [notify]);

  const loadProducts = useCallback(async () => {
    try {
      setProducts(await api('/api/admin/products'));
    } catch (error) {
      notify(error.message);
    }
  }, [notify]);

  const loadOrders = useCallback(async () => {
    try {
      setOrders(await api('/api/admin/orders'));
    } catch (error) {
      notify(error.message);
    }
  }, [notify]);

  const loadMessages = useCallback(async () => {
    try {
      setMessages(await api('/api/admin/messages'));
    } catch (error) {
      notify(error.message);
    }
  }, [notify]);

  const loadAll = useCallback(() => {
    loadDashboard();
    loadProducts();
    loadOrders();
    loadMessages();
  }, [loadDashboard, loadProducts, loadOrders, loadMessages]);

  // El error se lanza hacia el formulario para que lo muestre debajo
  const saveProduct = async (id, data) => {
    await api(id ? `/api/admin/products/${encodeURIComponent(id)}` : '/api/admin/products', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(data)
    });
    notify(id ? 'Producto actualizado.' : 'Producto creado.');
    loadProducts();
    loadDashboard();
  };

  const deleteProduct = async (id) => {
    try {
      await api(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
      notify('Producto eliminado.');
      loadProducts();
      loadDashboard();
    } catch (error) {
      notify(error.message);
    }
  };

  const changeOrderStatus = async (id, status) => {
    try {
      await api(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
      notify('Estado del pedido actualizado.');
      loadDashboard();
    } catch (error) {
      notify(error.message);
    }
  };

  const changeMessageStatus = async (id, status) => {
    try {
      await api(`/api/admin/messages/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setMessages((current) => current.map((message) => (message.id === id ? { ...message, status } : message)));
      notify('Estado del mensaje actualizado.');
      loadDashboard();
    } catch (error) {
      notify(error.message);
    }
  };

  return {
    dashboard, products, orders, messages,
    loadAll, saveProduct, deleteProduct, changeOrderStatus, changeMessageStatus
  };
}

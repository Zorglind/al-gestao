import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  barcode: string;
  price: number;
  cost: number;
  stock_quantity: number;
  image_url: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  category: string;
  brand?: string;
  description?: string;
  barcode?: string;
  price: number;
  cost?: number;
  stock_quantity?: number;
  image_url?: string;
}

export interface UpdateProductData {
  name?: string;
  category?: string;
  brand?: string;
  description?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  stock_quantity?: number;
  image_url?: string;
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }

    return data;
  },

  async create(productData: CreateProductData): Promise<Product> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }

    return data;
  },

  async update(id: string, productData: UpdateProductData): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async uploadImage(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async getStatistics(): Promise<{
    totalProducts: number;
    lowStockProducts: number;
    totalStock: number;
    averagePrice: number;
  }> {
    const { data, error } = await supabase
      .from('products')
      .select('price, stock_quantity')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching product statistics:', error);
      throw error;
    }

    const totalProducts = data?.length || 0;
    const lowStockProducts = data?.filter(p => (p.stock_quantity || 0) <= 5).length || 0;
    const totalStock = data?.reduce((acc, p) => acc + (p.stock_quantity || 0), 0) || 0;
    const averagePrice = totalProducts > 0 
      ? data?.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts 
      : 0;

    return {
      totalProducts,
      lowStockProducts,
      totalStock,
      averagePrice
    };
  }
};
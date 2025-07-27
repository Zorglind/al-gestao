import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  description?: string;
  price: number;
  cost?: number;
  stock_quantity?: number;
  barcode?: string;
  image_url?: string;
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
  price: number;
  cost?: number;
  stock_quantity?: number;
  barcode?: string;
  image_url?: string;
}

export interface UpdateProductData {
  name?: string;
  category?: string;
  brand?: string;
  description?: string;
  price?: number;
  cost?: number;
  stock_quantity?: number;
  barcode?: string;
  image_url?: string;
}

class ProductsService {
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de produtos - getAll:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Erro ao buscar produto por ID:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de produtos - getById:', error);
      throw error;
    }
  }

  async create(productData: CreateProductData): Promise<Product> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de produtos - create:', error);
      throw error;
    }
  }

  async update(id: string, productData: UpdateProductData): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro no serviço de produtos - update:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Soft delete - marca como inativo
      const { error } = await supabase
        .from('products')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro no serviço de produtos - delete:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Erro no serviço de produtos - uploadImage:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }

      // Extrair categorias únicas
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories.filter(Boolean);
    } catch (error) {
      console.error('Erro no serviço de produtos - getCategories:', error);
      return [];
    }
  }

  async search(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro no serviço de produtos - search:', error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();
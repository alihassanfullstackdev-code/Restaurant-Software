import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Components
import { MenuHeader } from '../../components/menu_management/MenuHeader';
import { MenuSidebar } from '../../components/menu_management/MenuSidebar';
import { ProductTable } from '../../components/menu_management/ProductTable';
import { TableSkeleton } from '../../components/TableSkeleton';
import { AddItemModal } from '../../components/AddItem';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function MenuManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products?all_items=true&page=${page}`),
        axios.get(`${API_BASE_URL}/categories`)
      ]);
      
      // Laravel Pagination support
      setProducts(prodRes.data.data || prodRes.data); 
      setCurrentPage(prodRes.data.current_page || 1);
      setLastPage(prodRes.data.last_page || 1);
      setCategories(catRes.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Professional Excel Export ---
      const handleExport = async () => {
      // Loading indicator dikhayein kyunke data zyada ho sakta hai
      Swal.fire({
        title: 'Generating Report...',
        text: 'Fetching all menu items, please wait.',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      try {
        // API se saara data mangwaein (Bina pagination ke)
        const response = await axios.get(`${API_BASE_URL}/products?export=true`);
        const allProducts = response.data; // Array of all products

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Full Inventory');

        // 1. Columns Setup
        worksheet.columns = [
          { header: 'ID', key: 'id', width: 10 },
          { header: 'Item Name', key: 'name', width: 35 },
          { header: 'Category', key: 'category', width: 20 },
          { header: 'Price (PKR)', key: 'price', width: 15 },
          { header: 'Status', key: 'status', width: 15 },
        ];

        // 2. Header Styling (Professional Dark Theme)
        const headerRow = worksheet.getRow(1);
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // 3. Add All Data Rows
        allProducts.forEach((item: any) => {
          const row = worksheet.addRow({
            id: item.id,
            name: item.name,
            category: item.category?.name || 'Uncategorized',
            price: item.price,
            status: item.is_available === 1 ? 'ACTIVE' : 'HIDDEN'
          });

          // Price alignment
          row.getCell('price').alignment = { horizontal: 'right' };
          
          // Status Color Formatting
          const statusCell = row.getCell('status');
          statusCell.font = { 
            bold: true, 
            color: { argb: item.is_available === 1 ? 'FF16A34A' : 'FFDC2626' } 
          };
        });

        // 4. Borders and Design
        worksheet.eachRow((row, rowNumber) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
              bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };
          });
        });

        // 5. Save the File
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `RestoPos_Full_Menu_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        Swal.fire({
          icon: 'success',
          title: 'Export Complete',
          text: `${allProducts.length} items exported to Excel.`,
        });

      } catch (error) {
        console.error("Export Error:", error);
        Swal.fire('Export Failed', 'Could not fetch all data from server.', 'error');
      }
    };

  const toggleStatus = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await axios.put(`${API_BASE_URL}/products/${id}`, { is_available: newStatus });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_available: newStatus } : p));
    } catch (error) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/products/${id}`);
          setProducts(prev => prev.filter(p => p.id !== id));
          Swal.fire('Deleted!', 'Item has been removed.', 'success');
        } catch (e) {
          Swal.fire('Error', 'Delete failed', 'error');
        }
      }
    });
  };

  const filteredItems = products.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category_id.toString() === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

      const handleEditClick = (product: any) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
    };
  // MenuManagement.tsx ke andar ye function add karein:

    const handleSaveProduct = async (formData: FormData) => {
      try {
        // Agar initialData (Edit mode) hai to PUT request, warna POST
        const url = selectedProduct 
          ? `${API_BASE_URL}/products/${selectedProduct.id}` 
          : `${API_BASE_URL}/products`;
        
        // Laravel mein PUT ke sath spoofing zaroori hoti hai agar image bhej rahe hon
        if (selectedProduct) formData.append('_method', 'PUT');

        await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        Swal.fire('Success', 'Product saved successfully!', 'success');
        fetchData(currentPage); // Table refresh karein
        return null; // Koi error nahi hai
      } catch (error: any) {
        console.error("Save Error:", error);
        // Agar Laravel validation errors bhej raha hai to return karein
        return error.response?.data?.errors || { general: ['Something went wrong'] };
      }
    };
  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      {/* Header with Export & Add Logic */}
        <MenuHeader 
          onAddClick={() => {
            setSelectedProduct(null); // Naya item add karne ke liye reset
            setIsModalOpen(true);
          }} 
          onExport={handleExport} // <--- Yeh link missing thi
        />

      <div className="flex flex-col lg:flex-row gap-8">
        <MenuSidebar 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} 
        />

        <div className="flex-1 flex flex-col gap-6">
          {loading ? (
            <TableSkeleton />
          ) : (
            <ProductTable 
              products={filteredItems} 
              onToggle={toggleStatus} 
              onDelete={handleDelete}
              onEdit={handleEditClick}
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={(page: number) => fetchData(page)}
            />
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {/* Add Item Modal */}
        <AddItemModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null); // Reset after close
          }}
          categories={categories}
          onRefresh={() => fetchData(currentPage)}
          onSave={handleSaveProduct}    // <--- Yeh missing tha
          initialData={selectedProduct} // <--- Yeh missing tha
        />
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import CreateListingModal from './CreateListingModal'; // Import your component

const Listings = ({ onSelectItem, myListings }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [sortOption, setSortOption] = useState("date_desc");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = myListings
                ? 'http://localhost:3000/v2/products/mylistings'
                : 'http://localhost:3000/v2/products';

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch products');

            const data = await response.json();
            const finalData = myListings ? data : data.sort(() => Math.random() - 0.5);
            setProducts(finalData);
        } catch (err) {
            // Do nothing 
        } finally {
            setLoading(false);
        }
    };

     const deleteProduct = async (prodId) => { 
        try {
            console.log({prodId});
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/products/delete/${prodId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                
            });

            const data = await response.json();

            if (response.ok) {
                  setProducts(prev =>
                    prev.filter(product => product.id !== prodId)
                    );        
            }
        } catch (err) {
            console.error("Failed to Delete listing:", err);
        }
    }; 

    useEffect(() => {
        fetchProducts();
    }, [myListings]);

    const filteredAndSortedProducts = [...products]
        .filter(product=>product.title.toLowerCase().includes(searchTerm.toLowerCase()))     
        .sort((a, b) => {
        switch (sortOption) {
            case "price_asc":
                return a.price - b.price;
            case "price_desc":
                return b.price - a.price;
            case "date_asc":
                return new Date(a.created_at) - new Date(b.created_at);
            case "date_desc":
            default:
                return new Date(b.created_at) - new Date(a.created_at);
            }
        });

    if (loading) return <div className="text-slate-400 text-center py-20 italic">Loading...</div>;

    return (
        <>
            {/* Issue 3: Enhanced the application with the sorting feature 
                Issue 4: Enhanced the application with Search/Filter feature*/}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">
                    {myListings ? "My Listings" : "Browse Listings"}
                </h1>
                <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"/>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="date_desc">Date Posted (Newest)</option>
                    <option value="date_asc">Date Posted (Oldest)</option>
                    <option value="price_asc">Price (Low - High)</option>
                    <option value="price_desc">Price (High - Low)</option>
                 </select>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

                {filteredAndSortedProducts.map((product) => (
                    <ItemCard
                        key={product.id}
                        image={product.image_url || `https://picsum.photos/seed/${product.id}/400/400`}
                        title={product.title}
                        price={product.price}
                        prodId={product.id}
                        onView={() => onSelectItem(product)}
                        onDelete={deleteProduct}
                        createdDate={product.created_at}
                    />
                ))}

                {myListings && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:bg-slate-800/50 transition-all group min-h-[250px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                            <span className="text-2xl text-slate-400 group-hover:text-white">+</span>
                        </div>
                        <span className="text-slate-400 font-medium group-hover:text-white">Create Listing</span>
                    </button>
                )}
            </div>

            <CreateListingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchProducts} // Re-fetches the list after a successful post
            />
        </>
    );
};

export default Listings;
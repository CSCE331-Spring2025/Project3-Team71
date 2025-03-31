import React from 'react'

import { useState } from 'react';

export default function ViewSalesPage() {
    const [salesData, setSalesData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchSalesData() {
        try {
            const res = await fetch('/api/sales_data');
            if (!res.ok) throw new Error('Failed to fetch sales data');
            const data = await res.json();
            setSalesData(data.sales_data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        fetchSalesData();
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Sales Data</h1>
            <table>
                <thead>
                    <tr>
                        <th>Sale ID</th>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.map((sale) => (
                        <tr key={sale.sale_id}>
                            <td>{sale.sale_id}</td>
                            <td>{sale.item_name}</td>
                            <td>{sale.quantity_sold}</td>
                            <td>{sale.total_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
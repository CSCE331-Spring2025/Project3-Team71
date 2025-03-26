"use client"; // Ensure this is at the very top if in the app directory

export default function TestPage() {
  return (
    <div
      onClick={() => console.log("Div clicked")}
      style={{ border: "1px solid red", padding: "20px", cursor: "pointer" }}
    >
      Click me
    </div>
  );
}




// "use client";

// import { useState } from 'react';

// // Hardcoded menu data
// const menuItems = [
//   { id: 1, buyPrice: 1.5, sellPrice: 4.5, happyHourPrice: 3.5, itemName: "Classic Pearl Milk Tea", itemType: "Milk Tea", ingredients: [1, 3, 5, 12, 13, 16] },
//   { id: 2, buyPrice: 1.6, sellPrice: 4.75, happyHourPrice: 3.75, itemName: "Classic Milk Tea with Grass Jelly", itemType: "Milk Tea", ingredients: [1, 3, 9, 12, 13, 16] },
//   { id: 6, buyPrice: 1.6, sellPrice: 4.75, happyHourPrice: 3.75, itemName: "Wintermelon Lemon Tea", itemType: "Fruit Tea", ingredients: [2, 19, 11, 12, 13, 16] },
//   { id: 7, buyPrice: 1.7, sellPrice: 5, happyHourPrice: 4, itemName: "Passion Fruit Green Tea", itemType: "Fruit Tea", ingredients: [2, 11, 12, 13, 16] },
//   { id: 9, buyPrice: 1.5, sellPrice: 4.5, happyHourPrice: 3.5, itemName: "Mango Green Tea", itemType: "Fruit Tea", ingredients: [2, 19, 12, 13, 16] },
//   { id: 12, buyPrice: 1.85, sellPrice: 5.25, happyHourPrice: 4.5, itemName: "Matcha Latte", itemType: "Fresh Milk", ingredients: [3, 17, 12, 13, 16] },
//   { id: 8, buyPrice: 1.8, sellPrice: 5, happyHourPrice: 4.25, itemName: "Lychee Green Tea", itemType: "Fruit Tea", ingredients: [2, 10, 9, 12, 13, 16] },
//   { id: 3, buyPrice: 1.7, sellPrice: 6, happyHourPrice: 3, itemName: "Honey Milk Tea", itemType: "Milk Tea", ingredients: [1, 3, 8, 12, 13, 16] },
//   { id: 4, buyPrice: 1.8, sellPrice: 5.25, happyHourPrice: 4.25, itemName: "Matcha Red Bean Milk Tea", itemType: "Milk Tea", ingredients: [1, 3, 17, 12, 13, 16] },
//   // Assigned id 10 for the item with missing id in the table
//   { id: 10, buyPrice: 2, sellPrice: 8, happyHourPrice: 5.6, itemName: "John's Famous Boba", itemType: "Milk Tea", ingredients: [1, 3, 5, 12] },
//   { id: 14, buyPrice: 2, sellPrice: 5.75, happyHourPrice: 4.75, itemName: "Chocolate Ice Blended", itemType: "Ice Blended", ingredients: [3, 12, 13, 16] },
//   { id: 11, buyPrice: 1.75, sellPrice: 5, happyHourPrice: 1, itemName: "Fresh Milk with Boba", itemType: "Fresh Milk", ingredients: [3, 5, 12, 13, 16] },
//   { id: 32, buyPrice: 3.5, sellPrice: 5.5, happyHourPrice: 4.5, itemName: "Hawaii Fruit Tea", itemType: "Fruit Tea", ingredients: [7, 14, 15, 19, 12, 13, 16] },
//   { id: 16, buyPrice: 2.2, sellPrice: 7.25, happyHourPrice: 5.5, itemName: "Mango Ice Blended", itemType: "Ice Blended", ingredients: [3, 19, 12, 13, 16] },
//   { id: 33, buyPrice: 4, sellPrice: 2, happyHourPrice: 3, itemName: "Matcha with Fresh Milk", itemType: "Fresh Milk", ingredients: [17, 3, 12, 13, 16] },
//   // Assigned id 23 for Tanmay Tea with missing id
//   { id: 23, buyPrice: 2, sellPrice: 4, happyHourPrice: 3, itemName: "Tanmay Tea", itemType: "Milk Tea", ingredients: [17, 8, 16] },
//   { id: 13, buyPrice: 1.95, sellPrice: 6.5, happyHourPrice: 4.75, itemName: "Oreo Ice Blended", itemType: "Ice Blended", ingredients: [3, 12, 13, 16] },
//   { id: 18, buyPrice: 1.6, sellPrice: 4.75, happyHourPrice: 3.75, itemName: "Crema Green Tea", itemType: "Crema", ingredients: [2, 3, 12, 13, 16] },
//   { id: 28, buyPrice: 2, sellPrice: 4, happyHourPrice: 3, itemName: "Fresh Milk Tea (Black/Green/Oolong Tea)", itemType: "Fresh Milk", ingredients: [3, 12, 13, 16] },
//   { id: 29, buyPrice: 3.5, sellPrice: 5.5, happyHourPrice: 4.5, itemName: "Strawberry Tea", itemType: "Fruit Tea", ingredients: [7, 10, 14, 15, 12, 13, 16] },
//   { id: 30, buyPrice: 2, sellPrice: 4, happyHourPrice: 3, itemName: "Wintermelon with Fresh Milk", itemType: "Fresh Milk", ingredients: [3, 12, 13, 16] },
//   { id: 34, buyPrice: 3.5, sellPrice: 5.5, happyHourPrice: 4.5, itemName: "Honey Lemonade", itemType: "Fruit Tea", ingredients: [14, 15, 12, 13, 16] },
//   { id: 35, buyPrice: 4, sellPrice: 2, happyHourPrice: 3, itemName: "Fresh Milk Family", itemType: "Fresh Milk", ingredients: [18, 6, 3, 12, 13, 16] },
//   { id: 37, buyPrice: 4, sellPrice: 2, happyHourPrice: 3, itemName: "Handmade Taro with Fresh Milk", itemType: "Fresh Milk", ingredients: [3, 12, 13, 16] },
//   { id: 44, buyPrice: 2.5, sellPrice: 4.5, happyHourPrice: 4, itemName: "Peach Mojito", itemType: "Mojito's", ingredients: [15, 8, 19, 12, 16, 14, 7, 11] },
//   { id: 15, buyPrice: 2.1, sellPrice: 6, happyHourPrice: 5.25, itemName: "Taro Ice Blended", itemType: "Ice Blended", ingredients: [3, 18, 12, 13, 16] },
//   { id: 38, buyPrice: 4, sellPrice: 6.5, happyHourPrice: 5.5, itemName: "Milk Tea Ice Blended", itemType: "Ice Blended", ingredients: [14, 5, 3, 12, 13, 16] },
//   { id: 39, buyPrice: 4, sellPrice: 6.5, happyHourPrice: 5.5, itemName: "Peach Tea Ice Blended", itemType: "Ice Blended", ingredients: [14, 7, 9, 16, 11] },
//   { id: 40, buyPrice: 4, sellPrice: 6.5, happyHourPrice: 5.5, itemName: "Thai Tea Ice Blended", itemType: "Ice Blended", ingredients: [24, 12, 13, 16, 6, 15] },
//   { id: 41, buyPrice: 2, sellPrice: 4.5, happyHourPrice: 4, itemName: "Lime Mojito", itemType: "Mojito's", ingredients: [14, 7, 12, 13, 16] },
//   { id: 43, buyPrice: 3, sellPrice: 4.5, happyHourPrice: 4, itemName: "Mango Mojito", itemType: "Mojito's", ingredients: [7, 12, 13, 16, 19] },
//   { id: 19, buyPrice: 1.7, sellPrice: 5, happyHourPrice: 4, itemName: "Crema Matcha", itemType: "Crema", ingredients: [17, 1, 12, 13, 16, 3] },
//   { id: 17, buyPrice: 1.5, sellPrice: 4.5, happyHourPrice: 3.5, itemName: "Crema Black Tea", itemType: "Crema", ingredients: [1, 3, 12, 13, 16] },
//   { id: 31, buyPrice: 2, sellPrice: 4, happyHourPrice: 3, itemName: "Cocoa Lover with Fresh Milk", itemType: "Fresh Milk", ingredients: [12, 13, 3] },
//   { id: 42, buyPrice: 3, sellPrice: 4.5, happyHourPrice: 4, itemName: "Strawberry Mojito", itemType: "Mojito's", ingredients: [8, 10, 13, 16, 7] },
//   { id: 51, buyPrice: 2, sellPrice: 5, happyHourPrice: 4, itemName: "Seasonal Drink", itemType: "Mojito's", ingredients: [12, 13, 16, 7] },
//   // Only one instance of Taele Tea (duplicate rows merged)
//   { id: 20, buyPrice: 2, sellPrice: 5.25, happyHourPrice: 4, itemName: "Taele Tea", itemType: "Crema", ingredients: [19, 12, 13, 16, 3, 2] },
// ];

// export default function Page() {
//   const [order, setOrder] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   // Default customization: Medium ice and no ingredients removed.
//   const [customization, setCustomization] = useState({ ice: "Medium", removedIngredients: [] });

//   // Opens the customization modal for the clicked item
//   const openCustomization = (item) => {
//     setSelectedItem(item);
//     setCustomization({ ice: "Medium", removedIngredients: [] });
//   };

//   // Adds the customized item to the order list
//   const addCustomizedItem = () => {
//     // Attach the customization details to the item
//     const customizedItem = { ...selectedItem, customization };
//     setOrder((prevOrder) => [...prevOrder, customizedItem]);
//     setSelectedItem(null);
//   };

//   // Removes an item from the order by its index
//   const removeFromOrder = (index) => {
//     setOrder((prevOrder) => prevOrder.filter((_, i) => i !== index));
//   };

//   // Calculate the total using the sell price of each item
//   const total = order.reduce((sum, item) => sum + item.sellPrice, 0);

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Bubble Tea Kiosk</h1>
//       <div style={{ display: 'flex', gap: '40px' }}>
//         {/* Menu Section */}
//         <div style={{ flex: 1 }}>
//           <h2>Menu</h2>
//           {menuItems.map((item) => (
//             <div
//   key={item.id}
//   style={{
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     marginBottom: '10px',
//     padding: '10px',
//     cursor: 'pointer',
//   }}
//   onClick={() => {
//     console.log("Item clicked", item);
//     openCustomization(item);
//   }}
// >
//   <h3>{item.itemName}</h3>
//   <p>Type: {item.itemType}</p>
//   <p>Price: ${item.sellPrice.toFixed(2)}</p>
// </div>


//         {/* Order Summary Section */}
//         <div style={{ flex: 1 }}>
//           <h2>Your Order</h2>
//           {order.length === 0 ? (
//             <p>No items in your order yet.</p>
//           ) : (
//             <div>
//               {order.map((item, index) => (
//                 <div key={index} style={{ marginBottom: '5px' }}>
//                   {item.itemName} - ${item.sellPrice.toFixed(2)}
//                   {item.customization && (
//                     <div style={{ fontSize: '0.9em', color: '#555' }}>
//                       (Ice: {item.customization.ice}
//                       {item.customization.removedIngredients.length > 0 &&
//                         `, Removed: ${item.customization.removedIngredients.join(', ')}`})
//                     </div>
//                   )}
//                   <button onClick={() => removeFromOrder(index)}>Remove</button>
//                 </div>
//               ))}
//               <h3>Total: ${total.toFixed(2)}</h3>
//               <button onClick={() => alert('Order placed!')}>Checkout</button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Customization Modal */}
//       {selectedItem && (
//         <div
//           style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100vw',
//             height: '100vh',
//             background: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
//             <h2>Customize {selectedItem.itemName}</h2>

//             {/* Ice Level Option */}
//             <div style={{ marginBottom: '10px' }}>
//               <label>
//                 Ice Level:{' '}
//                 <select
//                   value={customization.ice}
//                   onChange={(e) => setCustomization({ ...customization, ice: e.target.value })}
//                 >
//                   <option value="Light">Light</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Heavy">Heavy</option>
//                 </select>
//               </label>
//             </div>

//             {/* Remove Ingredients Option */}
//             <div style={{ marginBottom: '10px' }}>
//               <p>Remove Ingredients:</p>
//               {selectedItem.ingredients.map((ingredient) => (
//                 <div key={ingredient}>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={customization.removedIngredients.includes(ingredient)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setCustomization({
//                             ...customization,
//                             removedIngredients: [...customization.removedIngredients, ingredient],
//                           });
//                         } else {
//                           setCustomization({
//                             ...customization,
//                             removedIngredients: customization.removedIngredients.filter((id) => id !== ingredient),
//                           });
//                         }
//                       }}
//                     />
//                     Ingredient {ingredient}
//                   </label>
//                 </div>
//               ))}
//             </div>

//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <button onClick={() => setSelectedItem(null)}>Cancel</button>
//               <button onClick={addCustomizedItem}>Add to Order</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

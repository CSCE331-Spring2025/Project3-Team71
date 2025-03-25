import Link from 'next/link'

async function fetchMenuItems() {
  const res = await fetch('http://localhost:3000/api/menu', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch menu items');
  }
  return res.json();
}

export default async function Page() {
  let menuItems = [];
  try {
    menuItems = await fetchMenuItems();
  } catch (error) {
    console.error(error);
  }
  console.log(menuItems); // Log the fetched menu items to the console
  return (
    <div>
    <h1>This is home page</h1>
        <p>Welcome to Tea71</p>
        <br />
        <button className="bg-blue-400 my-2 text-white p-1 rounded">
          <Link href={`/login`}>Login</Link>
        </button>

        <h2 className="mt-4">Menu</h2>
        {menuItems.length > 0 ? (
          menuItems.map((category) => (
            <div key={category.item_type}>
              <h3 className="font-bold">{category.item_name}</h3>
            </div>
          ))
        ) : (
          <p>No menu items found.</p>
        )}
    </div>
  )
}


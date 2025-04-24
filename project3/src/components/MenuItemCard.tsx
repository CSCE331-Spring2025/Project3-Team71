import { useHappyHourStatus } from "@/hooks/useHappyHourStatus";

interface MenuItem {
  item_name: string;
  item_type: string;
  sell_price: number;
  happy_hour_price: number;
}

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const isHappyHour = useHappyHourStatus();
  const displayPrice = isHappyHour ? item.happy_hour_price : item.sell_price;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3 className="text-lg font-bold">{item.item_name}</h3>
      <p className="text-sm text-gray-500">{item.item_type}</p>
      <p className="mt-2 text-xl font-semibold text-green-600">
        ${displayPrice.toFixed(2)}
      </p>
      {isHappyHour && (
        <p className="text-xs text-yellow-600 mt-1">Happy Hour Price!</p>
      )}
    </div>
  );
}

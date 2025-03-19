import Link from 'next/link'


export default function Page() {
  return (
    <div>
    <h1>This is home page</h1>
        <p>Welcome to Tea71</p>
        <p>Choose your role to continue:</p>
        <br />
        <Link href={`/customer`}>Customer</Link>
        <br />
        <br />
        <Link href={`/cashier`}>Cashier</Link>
        <br />
        <br />
        <Link href={`/manager`}>Manager</Link>
    </div>
  )
}


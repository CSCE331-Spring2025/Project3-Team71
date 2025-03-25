import Link from 'next/link'


export default function Page() {
  return (
    <div>
    <h1>This is home page</h1>
        <p>Welcome to Tea71</p>
        <br />
        <button className="bg-blue-400 my-2 text-white p-1 rounded">
          <Link href={`/login`}>Login</Link>
        </button>
    </div>
  )
}


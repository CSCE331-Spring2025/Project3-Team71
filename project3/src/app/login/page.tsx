import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl my-3">Log in</h1>
            <p className="text-lg mb-5">Welcome back to Tea71</p>
            <LoginForm />
        </div>
    );
}

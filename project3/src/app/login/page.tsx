import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-3xl my-3">Welcome back to Tea71</h1>
            <LoginForm />
        </div>
    );
}

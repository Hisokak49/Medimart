import { SignUp } from "@clerk/clerk-react";

const Register = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="shadow-xl rounded-2xl overflow-hidden border border-slate-100 bg-white">
        <SignUp signInUrl="/login" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
};

export default Register;

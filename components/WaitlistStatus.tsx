"use client";

import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface WaitlistStatusProps {
  status: "WAITLIST" | "APPROVED" | "REJECTED";
  approvedAt?: Date;
}

export function WaitlistStatus({ status, approvedAt }: WaitlistStatusProps) {
  const getStatusInfo = () => {
    switch (status) {
      case "WAITLIST":
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          title: "Account Pending Approval",
          description: "Your account is currently under review. We'll notify you once it's approved.",
          color: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
        };
      case "APPROVED":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          title: "Account Approved!",
          description: `Your account was approved on ${
            approvedAt ? new Date(approvedAt).toLocaleDateString() : "recently"
          }. Welcome to DIA!`,
          color: "border-green-500/20 bg-green-500/10 text-green-300",
        };
      case "REJECTED":
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          title: "Account Rejected",
          description: "Unfortunately, your account has been rejected. Please contact support for more information.",
          color: "border-red-500/20 bg-red-500/10 text-red-300",
        };
      default:
        return {
          icon: <AlertCircle className="h-6 w-6 text-gray-500" />,
          title: "Unknown Status",
          description: "Your account status is unclear. Please contact support.",
          color: "border-gray-500/20 bg-gray-500/10 text-gray-300",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className={`rounded-2xl border p-8 text-center ${statusInfo.color}`}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              {statusInfo.icon}
            </div>

            <h1 className="mb-4 text-2xl font-bold">{statusInfo.title}</h1>

            <p className="mb-6 text-sm leading-relaxed opacity-90">{statusInfo.description}</p>

            {status === "WAITLIST" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="mb-2 font-semibold">What happens next?</h3>
                  <ul className="space-y-1 text-left text-xs">
                    <li>• Our team will review your application</li>
                    <li>• You'll receive an email notification</li>
                    <li>• Once approved, you can access DIA</li>
                    <li>• This usually takes 24-48 hours</li>
                  </ul>
                </div>

                <div className="text-xs opacity-70">
                  <p>Thank you for your patience!</p>
                  <p>We're excited to welcome you to DIA soon.</p>
                </div>
              </div>
            )}

            {status === "REJECTED" && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="mb-2 font-semibold">Need help?</h3>
                  <p className="text-xs">
                    Contact our support team at{" "}
                    <a href="mailto:support@dia.com" className="underline hover:opacity-80">
                      support@dia.com
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

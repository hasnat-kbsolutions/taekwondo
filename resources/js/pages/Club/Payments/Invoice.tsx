import React from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Invoice() {
    const { payment } = usePage().props as any;
    if (!payment) return <div>No payment found.</div>;

    const student = payment.student || {};
    const club = student.club || {};
    const organization = student.organization || {};
    const items = payment.items || [];
    const total = payment.total || payment.amount || 0;

    return (
 <div className="flex items-center justify-center min-h-screen bg-[#0e0e10] px-4 py-10 font-poppins">
  <Card className="w-full max-w-2xl rounded-xl bg-[#1b1b1d] border border-[#bebecf] shadow-[0_4px_20px_rgba(0,0,0,0.7)]">
    <CardHeader className="">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="text-right text-sm text-white font-medium">
            Invoice #{payment.id}
          </div>
          <CardTitle className="text-5xl font-bold text-white tracking-tight mt-3 mb-2">
            Invoice
          </CardTitle>
        </div>
      </div>
      <div className="mt-4 space-y-1 text-base text-white">
        <div className="flex justify-between">
          <span className="font-semibold">Date</span>
          <span>{payment.pay_at}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Month</span>
          <span>{payment.payment_month}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Status</span>
          <Badge className="capitalize bg-green-500/90 text-white font-medium px-3 py-0.5 rounded-md">
            {payment.status}
          </Badge>
        </div>
      </div>
        <div className=" pt-6  border-b  border-[#9999aa]" />
    </CardHeader>

    <CardContent className="pt-2 text-white">
      <Label className="text-xl font-semibold mb-3 block">
        Student Details
      </Label>
      <div className="space-y-2 text-base">
        <div className="flex justify-between">
          <span className="font-medium">Name</span>
          <span>{student.name} {student.surname}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Student ID</span>
          <span>{student.uid}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Club</span>
          <span>{club.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Organization</span>
          <span>{organization.name || "-"}</span>
        </div>
      </div>

      <div className="mt-6">
        <Label className="text-xl font-semibold mb-3 block">
          Items
        </Label>
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-base">
                <span>{item.description}</span>
                <span>${item.amount?.toFixed ? item.amount.toFixed(2) : item.amount}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white">No items listed.</div>
        )}
      </div>

      <div className="border-t border-[#9898a8] my-6" />

      <div className="flex justify-between items-center text-xl font-semibold">
        <span>Total</span>
        <span>${total?.toFixed ? total.toFixed(2) : total}</span>
      </div>

      {payment.notes && (
        <div className="text-sm mt-4">
          {payment.notes}
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <Button
          onClick={() => window.print()}
          className="bg-white text-black hover:bg-gray-200 font-semibold px-5 py-2 rounded-md"
        >
          Print Invoice
        </Button>
      </div>
    </CardContent>
  </Card>
</div>
    );
}

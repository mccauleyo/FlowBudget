import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Plus, Wallet, Building2, CreditCard, PiggyBank } from "lucide-react";

import { TopBar } from "@/components/flow/TopBar";
import { EmptySection } from "@/components/flow/EmptySection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
};

const ACCOUNT_TYPES = [
  { id: "checking", label: "Checking", icon: Wallet },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "credit", label: "Credit card", icon: CreditCard },
  { id: "other", label: "Other", icon: Building2 },
];

export const Route = createFileRoute("/_app/accounts")({
  head: () => ({
    meta: [{ title: "Accounts — FlowBudget" }],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("checking");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAccounts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        type,
        balance: Number.parseFloat(balance) || 0,
      },
    ]);
    setName("");
    setBalance("");
    setType("checking");
    setOpen(false);
  }

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <>
      <TopBar greeting="Accounts" subtitle="Track balances across your accounts" />
      <div data-tour="page-accounts" className="space-y-5">
        <div className="glass-strong rounded-[24px] p-6 md:p-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total balance</p>
            <p className="text-4xl font-semibold tabular-nums mt-1">${total.toLocaleString()}</p>
          </div>
          <Button type="button" className="rounded-full" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add account
          </Button>
        </div>

        {accounts.length === 0 ? (
          <div className="glass rounded-[24px]">
            <EmptySection
              icon={<Wallet className="size-5" />}
              title="No accounts yet"
              description="Add checking, savings, or credit accounts to see your combined balance here."
              actionLabel="Add your first account"
              onAction={() => setOpen(true)}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => {
              const typeMeta = ACCOUNT_TYPES.find((t) => t.id === account.type) ?? ACCOUNT_TYPES[0]!;
              const Icon = typeMeta.icon;
              return (
                <div
                  key={account.id}
                  className="glass rounded-[22px] p-5 hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl glass flex items-center justify-center text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{typeMeta.label}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold tabular-nums">${account.balance.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong border-border/60 sm:max-w-md">
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>Add account</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="acc-name">Account name</Label>
                <Input id="acc-name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="acc-balance">Current balance ($)</Label>
                <Input
                  id="acc-balance"
                  type="number"
                  step="0.01"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`rounded-xl px-3 py-2 text-sm border transition-colors ${
                        type === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

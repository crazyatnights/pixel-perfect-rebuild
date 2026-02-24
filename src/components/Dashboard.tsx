import { useState, useMemo } from 'react';
import { Lock, X, Pencil, ChevronLeft, ChevronRight, FileText, CreditCard, MoreHorizontal } from 'lucide-react';
import oceanBg from '@/assets/ocean-bg.jpg';
import BottomNav, { TopBar } from '@/components/BottomNav';
import { generateTransactions, type Transaction } from '@/lib/transactions';
import { format } from 'date-fns';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [view, setView] = useState<'home' | 'account'>('home');
  const [tab, setTab] = useState<'featured' | 'products'>('featured');
  const [showLoanBanner, setShowLoanBanner] = useState(true);
  const [txnStartDate, setTxnStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  });
  const [txnEndDate, setTxnEndDate] = useState(new Date());
  const [txnCount, setTxnCount] = useState(20);
  const [showConfig, setShowConfig] = useState(false);

  const transactions = useMemo(
    () => generateTransactions(txnStartDate, txnEndDate, txnCount),
    [txnStartDate, txnEndDate, txnCount]
  );

  const balance = 12.17;

  if (view === 'account') {
    return (
      <AccountDetail
        balance={balance}
        transactions={transactions}
        onBack={() => setView('home')}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        txnStartDate={txnStartDate}
        setTxnStartDate={setTxnStartDate}
        txnEndDate={txnEndDate}
        setTxnEndDate={setTxnEndDate}
        txnCount={txnCount}
        setTxnCount={setTxnCount}
      />
    );
  }

  return (
    <div className="h-screen max-w-md mx-auto bg-background flex flex-col overflow-hidden">
      {/* Hero section - 60% */}
      <div className="relative" style={{ height: '60%', minHeight: '60%' }}>
        <img src={oceanBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col">
          <TopBar />
          <div className="flex-1" />
          <div className="mx-4 mb-4 bg-card/95 backdrop-blur-sm rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold text-primary leading-tight">
                You are already
                <br />
                in your app
              </h2>
              <div className="w-11 h-11 rounded-full bg-bbva-cyan flex items-center justify-center text-primary font-bold text-sm">
                HU
              </div>
            </div>
            <button
              onClick={() => setView('account')}
              className="w-full mt-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base"
            >
              View all
            </button>
            <div className="flex items-start gap-2 mt-3 text-xs text-muted-foreground">
              <Lock size={14} className="mt-0.5 shrink-0" />
              <p>Alerta: BBVA nunca te solicitará por SMS que llames a un número de teléfono. Si recibes uno así, es falso.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom content - 40% */}
      <div className="flex flex-col" style={{ height: '40%' }}>
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <div />
          <h3 className="text-lg font-bold text-primary">Home</h3>
          <div />
        </div>

        <div className="px-4 flex-1 overflow-y-auto pb-16">
          {/* Quick payments */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-primary">Quick payments</h3>
              <Pencil size={18} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">💸 Send money with Bizum</p>
            <div className="bbva-card p-5">
              <h4 className="text-2xl font-bold text-primary mb-2">Bizum</h4>
              <p className="text-sm text-muted-foreground mb-4">Send or receive money to anyone you want, instantly and just by having their mobile number</p>
              <button className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold">Activate</button>
            </div>
          </div>
        </div>

        <BottomNav active="home" />
      </div>
    </div>
  );
};

/* ── Account summary card (reused in both tabs) ── */
const AccountCard = ({ balance, transactions, onTap }: { balance: number; transactions: Transaction[]; onTap: () => void }) => (
  <div className="bbva-card p-5 cursor-pointer" onClick={onTap}>
    <div className="flex items-center justify-between mb-1">
      <h4 className="text-xl font-bold text-primary">Account *67</h4>
      <span className="text-sm text-muted-foreground">•67</span>
    </div>
    <p className="text-3xl font-light text-foreground mt-2">{balance.toFixed(2)} €</p>
    <p className="text-sm text-muted-foreground">Available balance</p>

    <div className="mt-5 border-t border-border pt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-semibold text-foreground">Latest transactions</span>
        <button className="text-sm font-bold text-accent">See all</button>
      </div>
      {transactions.slice(0, 3).map((txn) => (
        <TransactionRow key={txn.id} txn={txn} />
      ))}
    </div>
  </div>
);

/* ── Transaction row ── */
const TransactionRow = ({ txn }: { txn: Transaction }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
      {txn.icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{txn.description}</p>
      <p className="text-xs text-muted-foreground">{format(txn.date, 'dd MMM yyyy')}</p>
    </div>
    <span className="text-sm font-semibold text-foreground whitespace-nowrap">{txn.amount.toFixed(2)} €</span>
  </div>
);

/* ── Group transactions by date ── */
function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  for (const txn of transactions) {
    const key = format(txn.date, 'dd MMM yyyy');
    if (!groups[key]) groups[key] = [];
    groups[key].push(txn);
  }
  return groups;
}

/* ── Account detail view ── */
interface AccountDetailProps {
  balance: number;
  transactions: Transaction[];
  onBack: () => void;
  showConfig: boolean;
  setShowConfig: (v: boolean) => void;
  txnStartDate: Date;
  setTxnStartDate: (d: Date) => void;
  txnEndDate: Date;
  setTxnEndDate: (d: Date) => void;
  txnCount: number;
  setTxnCount: (n: number) => void;
}

const AccountDetail = ({
  balance,
  transactions,
  onBack,
  showConfig,
  setShowConfig,
  txnStartDate,
  setTxnStartDate,
  txnEndDate,
  setTxnEndDate,
  txnCount,
  setTxnCount,
}: AccountDetailProps) => {
  const [page, setPage] = useState(1);
  const totalPages = 5;
  const grouped = useMemo(() => groupByDate(transactions), [transactions]);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background pb-20">
      <TopBar title="Account *67" showBack onBack={onBack} />

      {/* Balance card */}
      <div className="mx-4 bbva-card p-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-primary">Account *67</h3>
          <span className="text-sm text-muted-foreground">•67</span>
        </div>
        <p className="text-3xl font-light text-foreground mt-2">{balance.toFixed(2)} €</p>
        <p className="text-sm text-muted-foreground">Available balance</p>
        <p className="text-3xl font-light text-foreground mt-4">{balance.toFixed(2)} €</p>
        <p className="text-sm text-muted-foreground">Current balance</p>
        <button className="text-accent text-sm font-bold mt-4">See details and IBAN</button>
      </div>

      {/* Pagination */}
      <div className="mx-4 flex items-center justify-between mb-4">
        <span className="text-sm text-accent font-medium">{page} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Set money aside */}
      <div className="mx-4 bbva-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">🎯</span>
          <h4 className="font-bold text-foreground">Set money aside in your account</h4>
        </div>
        <p className="text-sm text-muted-foreground ml-9">If you don't see it, you don't spend it.</p>
        <button className="text-primary font-bold text-sm mt-2 ml-9">More</button>
      </div>

      {/* Customer benefits */}
      <div className="mx-4 bbva-card p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl">➕</div>
          <div>
            <h4 className="font-bold text-accent">As a customer, you get much more</h4>
            <p className="text-sm text-muted-foreground mt-1">Did you know you have exclusive benefits for being with BBVA? Discover them</p>
          </div>
        </div>
      </div>

      {/* Quick action icons */}
      <div className="mx-4 flex justify-around py-4 mb-4 bbva-card">
        <button className="flex flex-col items-center gap-1 text-primary">
          <FileText size={24} />
          <span className="text-[10px] font-medium">Documents</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <CreditCard size={24} />
          <span className="text-[10px] font-medium">Cards</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="text-xl">💸</span>
          <span className="text-[10px] font-medium text-primary">Bizum</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <MoreHorizontal size={24} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* Transaction config */}
      <div className="mx-4 mb-4">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="w-full py-3 rounded-xl border border-primary text-primary font-bold text-sm"
        >
          {showConfig ? 'Hide' : '⚙️ Configure'} Transaction Generator
        </button>
      </div>

      {showConfig && (
        <div className="mx-4 bbva-card p-5 mb-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Start Date</label>
            <input
              type="date"
              value={format(txnStartDate, 'yyyy-MM-dd')}
              onChange={(e) => setTxnStartDate(new Date(e.target.value))}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">End Date</label>
            <input
              type="date"
              value={format(txnEndDate, 'yyyy-MM-dd')}
              onChange={(e) => setTxnEndDate(new Date(e.target.value))}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Number of Transactions: {txnCount}</label>
            <input
              type="range"
              min={5}
              max={50}
              value={txnCount}
              onChange={(e) => setTxnCount(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      )}

      {/* Transactions list grouped by date */}
      <div className="mx-4 mb-4">
        <h3 className="text-lg font-bold text-primary mb-3">All Transactions</h3>
        <div className="bbva-card p-4">
          {Object.entries(grouped).map(([dateStr, txns]) => (
            <div key={dateStr} className="mb-4 last:mb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 border-b border-border pb-1">{dateStr}</p>
              {txns.map((txn) => (
                <TransactionRow key={txn.id} txn={txn} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
};

export default Dashboard;

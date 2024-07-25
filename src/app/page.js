"use client"
import { Button } from '@/components/ui/button'; // Adjust the path as necessary
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';
import { Alert } from '@/components/ui/alert';
import { useState } from 'react';


const symbols = [
  "🍒", "🍋", "🍉", "🍇", "🍓", "🍍", "🍏", "🍆", "🍈", "🥭", "🍑",
  "🍎", "🍊", "🍐", "🍔", "🍕", "🍲", "🍜", "🍱", "🍣", "🍙", "🍚",
  "🍛", "🍝", "🍠", "🍢", "🍥", "🍘", "🍿", "🥟", "🥠", "🥡", "🥢",
  "🥣", "🥤", "🍶", "🍵", "🍴", "🍽", "🥄", "🍩", "🍪", "🍫", "🍬",
  "🍭", "🍮", "🍯", "🍰", "🎂", "🍨", "🍧", "🍡", "🍦"
];

const values = {
    "🍒": 1000,
    "🍋": 500,
    "🍉": 2000,
    "🍇": 3000,
    "🍓": 1500,
    "🍍": 2500,
    "🍏": 800,
    "🍆": 1200,
    "🍈": 1800,
    "🥭": 2200,
    "🍑": 10000, // Nilai jackpot yang lebih tinggi
    "🍎": 600,
    "🍊": 700,
    "🍐": 800,
    "🍔": 1000,
    "🍕": 1100,
    "🍲": 1200,
    "🍜": 1300,
    "🍱": 1400,
    "🍣": 1500,
    "🍛": 1600,
    "🍝": 1700,
    "🍠": 1800,
    "🍢": 1900,
    "🍥": 2000,
    "🍘": 2100,
    "🍿": 2200,
    "🥟": 2300,
    "🥠": 2400,
    "🥡": 2500,
    "🥢": 2600,
    "🥣": 2700,
    "🥤": 2800,
    "🍶": 2900,
    "🍵": 3000,
    "🍴": 3100,
    "🍽": 3200,
    "🥄": 3300,
    "🍩": 3400,
    "🍪": 3500,
    "🍫": 3600,
    "🍬": 3700,
    "🍭": 3800,
    "🍮": 3900,
    "🍯": 4000,
    "🍰": 4100,
    "🎂": 4200,
    "🍨": 4300,
    "🍧": 4400,
    "🍡": 4500,
    "🍦": 4600
};
export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [slotSymbols, setSlotSymbols] = useState(["🍒", "🍋", "🍉"]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [amount, setAmount] = useState('');
  const [autoSpinCount, setAutoSpinCount] = useState(0);

  const spinCost = 1000;

  const updateBalance = (amount) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const spin = () => {
    if (spinning || balance < spinCost) {
      setAlertMessage("Saldo tidak cukup untuk melakukan spin.");
      setAlertOpen(true);
      return;
    }
    setSpinning(true);
    updateBalance(-spinCost);
    setResult('Semoga Beruntung');

    const animateSpin = (index, delay) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setSlotSymbols(prev => {
            const newSymbols = [...prev];
            newSymbols[index] = getRandomSymbol();
            return newSymbols;
          });
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setSlotSymbols(prev => {
            const newSymbols = [...prev];
            newSymbols[index] = getRandomSymbol();
            return newSymbols;
          });
          if (index === 2) {
            determineResult();
            setSpinning(false);
          }
        }, 1000);
      }, delay);
    };

    animateSpin(0, 0);
    animateSpin(1, 500);
    animateSpin(2, 1000);
  };

  const determineResult = () => {
    const [symbol1, symbol2, symbol3] = slotSymbols;

    let winAmount = 0;
    const jackpotChance = 0.10;

    if (Math.random() < jackpotChance) {
      winAmount = values["🍑"] + 5000;
      setResult(`Jackpot! Anda mendapatkan tambahan Rp 5.000!`);
    } else {
      if (symbol1 === symbol2 && symbol2 === symbol3) {
        winAmount = values[symbol1] * 3;
      } else if (symbol1 === symbol2 || symbol2 === symbol3 || symbol1 === symbol3) {
        if (symbol1 === symbol2) winAmount += values[symbol1] * 2;
        if (symbol2 === symbol3) winAmount += values[symbol2] * 2;
        if (symbol1 === symbol3) winAmount += values[symbol1] * 2;
      }
      if (winAmount > 0) {
        setResult(`Anda mendapatkan Rp ${winAmount.toLocaleString()}!`);
        updateBalance(winAmount);
      } else {
        setResult("Coba Kembali");
      }
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleAction = () => {
    const parsedAmount = parseInt(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      if (actionType === 'deposit') {
        setBalance(prevBalance => {
          const newBalance = prevBalance + parsedAmount;
          setAlertMessage(`Deposit berhasil! Saldo Anda sekarang Rp ${newBalance.toLocaleString()}`);
          return newBalance;
        });
      } else if (actionType === 'withdraw') {
        if (parsedAmount <= balance) {
          setBalance(prevBalance => {
            const newBalance = prevBalance - parsedAmount;
            setAlertMessage(`Penarikan berhasil! Saldo Anda sekarang Rp ${newBalance.toLocaleString()}`);
            return newBalance;
          });
        } else {
          setAlertMessage("Jumlah penarikan melebihi saldo.");
        }
      }
      setAmount('');
      setDialogOpen(false);
      setAlertOpen(true);
    } else {
      setAlertMessage("Jumlah tidak valid.");
      setAlertOpen(true);
    }
  };

  const startAutoSpin = (count) => {
    const totalSpinCost = spinCost * count;

    if (spinning || balance < totalSpinCost) {
      setAlertMessage("Saldo tidak cukup untuk melakukan spin.");
      setAlertOpen(true);
      return;
    }

    setAutoSpinCount(count);
    setSpinning(true);
    updateBalance(-totalSpinCost);
    setResult('Semoga Beruntung');

    const spinOneTime = (index) => {
      setSlotSymbols(prev => {
        const newSymbols = [...prev];
        newSymbols[index] = getRandomSymbol();
        return newSymbols;
      });
    };

    const spinSequence = (repeats) => {
      if (repeats > 0) {
        setTimeout(() => {
          for (let i = 0; i < 3; i++) {
            spinOneTime(i);
          }
          setTimeout(() => {
            determineResult();
            spinSequence(repeats - 1);
          }, 1000);
        }, 500);
      } else {
        setSpinning(false);
      }
    };

    spinSequence(count);
  };

  const openDialog = (type) => {
    setActionType(type);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-lg">
        <CardHeader className="p-6 bg-gray-200 border-b">
          <CardTitle className="text-xl font-semibold text-gray-800">Slot Machine Dashboard</CardTitle>
          <CardDescription className="text-sm text-gray-600">Spin the wheel and try your luck!</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center gap-4 mb-6">
            {slotSymbols.map((symbol, index) => (
              <Card key={index} className="flex items-center justify-center w-24 h-24 bg-gray-50 border border-gray-300 rounded-md shadow-md">
                <div className="text-3xl">{symbol}</div>
              </Card>
            ))}
          </div>
          <Button onClick={spin} className="w-full mb-4 bg-blue-600 text-white hover:bg-blue-700">
            {spinning ? 'Spinning...' : 'Spin'}
          </Button>
          <div className="text-center mb-4 text-lg font-medium text-gray-800">{result}</div>
          <div className="text-center mb-4 text-lg">
            Debit: <span className="font-semibold text-green-600">{balance.toLocaleString()}</span>
          </div>
          <Button onClick={() => openDialog('deposit')} className="w-full mb-2 bg-green-600 text-white hover:bg-green-700">
            Deposit
          </Button>
          <Button onClick={() => openDialog('withdraw')} className="w-full mb-4 bg-red-600 text-white hover:bg-red-700">
            Withdraw
          </Button>
          <div className="flex flex-wrap justify-center gap-2">
            {[10, 20, 30, 50, 100, 500, 1000].map(count => (
              <Button key={count} onClick={() => startAutoSpin(count)} className="w-24 bg-purple-600 text-white hover:bg-purple-700">
                {count}X Spin
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-gray-200 border-t">
          <div className="text-center text-sm text-gray-600">
            © 2024 Your Company. All Rights Reserved.
          </div>
        </CardFooter>
      </Card>

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setAlertOpen(false)}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deposit/Withdraw Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="p-4">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <AlertDialogFooter>
            <Button onClick={() => handleAction()} className="mr-2">
              {actionType === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Button>
            <Button onClick={() => setDialogOpen(false)} variant="outline">
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
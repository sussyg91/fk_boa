/**
 * BOA Central Data Store — data.js
 * Single source of truth for account holder profile, accounts,
 * balances, and full transaction history.
 *
 * Member since August 2026. All accounts opened August 2026.
 * Transactions run from Aug 1, 2026 through Sep 27, 2026.
 * September 17 is the biggest earning day (over $1,000,000).
 * Account 1 (Advantage Savings) closes at exactly $1,737,500.00.
 * Every running balance is mathematically chained.
 */

'use strict';

/* ================================================================
   ACCOUNT HOLDER PROFILE
   ================================================================ */
const BOA_PROFILE = {
  primary: {
    firstName: 'Jimmy',
    lastName:  'Bear',
    fullName:  'Jimmy Bear',
    role:      'Primary Account Holder',
  },
  joint: {
    firstName: 'Regina',
    lastName:  'Bear',
    fullName:  'Regina Bear',
    role:      'Joint Account Holder',
  },
  displayName:  'Jimmy & Regina Bear',
  phone:        '+1 (319) 240-2515',
  email:        'thegeniebear@gmail.com',
  memberSince:  'August 2026',
  customerId:   'BOA-JR-00482156',
};

/* ================================================================
   ACCOUNTS — all opened August 2026
   ================================================================ */
const BOA_ACCOUNTS = {
  '1': {
    label:        'Advantage Savings',
    mask:         '****1001',
    type:         'savings',
    routingNo:    '026009593',
    accountNo:    '****1001',
    interestRate: '0.04%',
    openDate:     '2026-08-01',
    balance:      1_737_500.00,   // ← authoritative current balance
    openingBal:   1_719_962.81,   // balance on Sep 1 before Sep transactions
  },
  '2': {
    label:        'Advantage Plus Checking',
    mask:         '****2001',
    type:         'checking',
    routingNo:    '026009593',
    accountNo:    '****2001',
    openDate:     '2026-08-01',
    balance:      8_342.17,
    openingBal:   6_155.47,
  },
  '3': {
    label:        'Secondary Savings',
    mask:         '****3001',
    type:         'savings',
    routingNo:    '026009593',
    accountNo:    '****3001',
    interestRate: '0.04%',
    openDate:     '2026-08-05',
    balance:      24_610.50,
    openingBal:   23_110.50,
  },
  '4': {
    label:        'Personal Loan',
    mask:         '****4001',
    type:         'loan',
    openDate:     '2026-08-10',
    balance:      97_240.00,
    openingBal:   98_000.00,
    originalLoan: 120_000.00,
    rate:         '5.75% APR',
    payment:      '$760.00 / mo',
  },
  '5': {
    label:        'Cash Rewards Credit Card',
    mask:         '****5001',
    type:         'credit',
    openDate:     '2026-08-15',
    balance:      2_185.43,
    openingBal:   0,
    creditLimit:  15_000.00,
    rate:         '19.99% APR',
    minPayment:   '$35.00',
    dueDate:      '2026-12-05',
  },
  '6': {
    label:        'Merrill Edge Brokerage',
    mask:         '****6001',
    type:         'brokerage',
    openDate:     '2026-08-20',
    balance:      61_874.92,
    openingBal:   59_200.00,
    portfolioReturn: '+4.5% YTD',
  },
};

/* ================================================================
   TRANSACTIONS
   All transactions: Aug 1 – Sep 27, 2026.
   Sep 17 = biggest single earning day (>$1,000,000).
   Every balance is previous ± amount.
   ================================================================ */
const BOA_TRANSACTIONS = {

  /* ── Account 1: Advantage Savings ────────────────────────────
     Open: Aug 1, 2026  |  Final: $1,737,500.00 on Sep 27, 2026

     Chain verification:
     Aug 01  +      500.00  →        500.00   (opening deposit)
     Aug 05  +    2,400.00  →      2,900.00   (payroll)
     Aug 12  +    4,500.00  →      7,400.00   (wire in)
     Aug 20  +    2,400.00  →      9,800.00   (payroll)
     Aug 25  +    5,000.00  →     14,800.00   (wire in)
     Aug 31  +       58.09  →     14,858.09   (interest)
     Sep 05  +    2,400.00  →     17,258.09   (payroll)
     Sep 10  +    4,500.00  →     21,758.09   (wire in)
     ★ Sep 17  +1,700,000.00  → 1,721,758.09  (BUSINESS SALE PROCEEDS)
     Sep 19  +    2,400.00  → 1,724,158.09   (payroll)
     Sep 22  −      200.00  → 1,723,958.09   (ATM)
     Sep 24  +       56.38  → 1,724,014.47   (interest)
     Sep 27  +   13,485.53  → 1,737,500.00   (wire received ✓)
  ─────────────────────────────────────────────────────────────── */
  '1': [
    // ── August 2026 ─────────────────────────────────────────────
    { date:'2026-08-01', desc:'ACCOUNT OPENING DEPOSIT',                category:'deposit',  deposit:500.00,         withdrawal:null,      balance:500.00,         status:'Completed' },
    { date:'2026-08-05', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:2_400.00,       withdrawal:null,      balance:2_900.00,       status:'Completed' },
    { date:'2026-08-12', desc:'WIRE TRANSFER RECEIVED — ACH CREDIT',    category:'transfer', deposit:4_500.00,       withdrawal:null,      balance:7_400.00,       status:'Completed' },
    { date:'2026-08-20', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:2_400.00,       withdrawal:null,      balance:9_800.00,       status:'Completed' },
    { date:'2026-08-25', desc:'WIRE TRANSFER RECEIVED — ACH CREDIT',    category:'transfer', deposit:5_000.00,       withdrawal:null,      balance:14_800.00,      status:'Completed' },
    { date:'2026-08-31', desc:'INTEREST CREDIT',                        category:'interest', deposit:58.09,          withdrawal:null,      balance:14_858.09,      status:'Completed' },
    // ── September 2026 ──────────────────────────────────────────
    { date:'2026-09-05', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:2_400.00,       withdrawal:null,      balance:17_258.09,      status:'Completed' },
    { date:'2026-09-10', desc:'WIRE TRANSFER RECEIVED — ACH CREDIT',    category:'transfer', deposit:4_500.00,       withdrawal:null,      balance:21_758.09,      status:'Completed' },
    // ★ BIGGEST EARNING DAY ──────────────────────────────────────
    { date:'2026-09-17', desc:'BUSINESS SALE PROCEEDS — WIRE TRANSFER', category:'transfer', deposit:1_700_000.00,   withdrawal:null,      balance:1_721_758.09,   status:'Completed' },
    // ────────────────────────────────────────────────────────────
    { date:'2026-09-19', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:2_400.00,       withdrawal:null,      balance:1_724_158.09,   status:'Completed' },
    { date:'2026-09-22', desc:'ATM WITHDRAWAL — MAIN ST BRANCH',        category:'atm',      deposit:null,           withdrawal:200.00,    balance:1_723_958.09,   status:'Completed' },
    { date:'2026-09-24', desc:'INTEREST CREDIT',                        category:'interest', deposit:56.38,          withdrawal:null,      balance:1_724_014.47,   status:'Completed' },
    { date:'2026-09-27', desc:'WIRE TRANSFER RECEIVED — SETTLEMENT',    category:'transfer', deposit:13_485.53,      withdrawal:null,      balance:1_737_500.00,   status:'Completed' },
  ],

  /* ── Account 2: Advantage Plus Checking ──────────────────────
     Open: Aug 1, 2026  |  Final: $8,342.17 on Sep 27, 2026

     Chain:
     Aug 01  +     500.00  →     500.00   (opening)
     Aug 05  +   3,850.00  →   4,350.00   (payroll)
     Aug 10  −   1,200.00  →   3,150.00   (rent)
     Aug 15  −      95.00  →   3,055.00   (phone bill)
     Aug 18  −     132.50  →   2,922.50   (electric)
     Aug 20  +   3,850.00  →   6,772.50   (payroll)
     Aug 22  −      79.99  →   6,692.51   (internet)
     Aug 25  −     212.80  →   6,479.71   (groceries)
     Aug 31  −      99.60  →   6,380.11   (telecom)
     Sep 01  +   3,850.00  →  10,230.11   (payroll)
     Sep 05  +     186.70  →  10,416.81   (check deposit)
     Sep 08  −   1,200.00  →   9,216.81   (rent)
     Sep 10  −      68.00  →   9,148.81   (gas)
     Sep 12  −      22.99  →   9,125.82   (netflix)
     Sep 15  +   3,850.00  →  12,975.82   (payroll)
     Sep 17  −     187.43  →  12,788.39   (groceries)
     Sep 20  −     548.00  →  12,240.39   (car payment)
     Sep 22  −      99.60  →  12,140.79   (telecom)
     Sep 25  −   3,798.62  →   8,342.17   (transfer to savings ✓)
  ─────────────────────────────────────────────────────────────── */
  '2': [
    // ── August 2026 ─────────────────────────────────────────────
    { date:'2026-08-01', desc:'ACCOUNT OPENING DEPOSIT',                category:'deposit',  deposit:500.00,         withdrawal:null,      balance:500.00,         status:'Completed' },
    { date:'2026-08-05', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:3_850.00,       withdrawal:null,      balance:4_350.00,       status:'Completed' },
    { date:'2026-08-10', desc:'RENT — LANDLORD ZELLE',                  category:'housing',  deposit:null,           withdrawal:1_200.00,  balance:3_150.00,       status:'Completed' },
    { date:'2026-08-15', desc:'MOBILE PHONE BILL — AUTO PAY',           category:'utilities',deposit:null,           withdrawal:95.00,     balance:3_055.00,       status:'Completed' },
    { date:'2026-08-18', desc:'ELECTRIC COMPANY — AUTO PAY',            category:'utilities',deposit:null,           withdrawal:132.50,    balance:2_922.50,       status:'Completed' },
    { date:'2026-08-20', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:3_850.00,       withdrawal:null,      balance:6_772.50,       status:'Completed' },
    { date:'2026-08-22', desc:'INTERNET SERVICE — AUTO PAY',            category:'utilities',deposit:null,           withdrawal:79.99,     balance:6_692.51,       status:'Completed' },
    { date:'2026-08-25', desc:'WALMART SUPERCENTER',                    category:'groceries',deposit:null,           withdrawal:212.80,    balance:6_479.71,       status:'Completed' },
    { date:'2026-08-31', desc:'TELECOM — AUTO PAY',                     category:'utilities',deposit:null,           withdrawal:99.60,     balance:6_380.11,       status:'Completed' },
    // ── September 2026 ──────────────────────────────────────────
    { date:'2026-09-01', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:3_850.00,       withdrawal:null,      balance:10_230.11,      status:'Completed' },
    { date:'2026-09-05', desc:'CHECK DEPOSIT — #1041',                  category:'deposit',  deposit:186.70,         withdrawal:null,      balance:10_416.81,      status:'Completed' },
    { date:'2026-09-08', desc:'RENT — LANDLORD ZELLE',                  category:'housing',  deposit:null,           withdrawal:1_200.00,  balance:9_216.81,       status:'Completed' },
    { date:'2026-09-10', desc:'SHELL GAS STATION',                      category:'gas',      deposit:null,           withdrawal:68.00,     balance:9_148.81,       status:'Completed' },
    { date:'2026-09-12', desc:'NETFLIX SUBSCRIPTION',                   category:'subscr',   deposit:null,           withdrawal:22.99,     balance:9_125.82,       status:'Completed' },
    { date:'2026-09-15', desc:'DIRECT DEPOSIT — PAYROLL',               category:'payroll',  deposit:3_850.00,       withdrawal:null,      balance:12_975.82,      status:'Completed' },
    { date:'2026-09-17', desc:'GROCERY STORE POS',                      category:'groceries',deposit:null,           withdrawal:187.43,    balance:12_788.39,      status:'Completed' },
    { date:'2026-09-20', desc:'CAR PAYMENT — AUTO LOAN',                category:'auto',     deposit:null,           withdrawal:548.00,    balance:12_240.39,      status:'Completed' },
    { date:'2026-09-22', desc:'TELECOM — AUTO PAY',                     category:'utilities',deposit:null,           withdrawal:99.60,     balance:12_140.79,      status:'Completed' },
    { date:'2026-09-25', desc:'TRANSFER TO SAVINGS ****1001',           category:'transfer', deposit:null,           withdrawal:3_798.62,  balance:8_342.17,       status:'Completed' },
  ],

  /* ── Account 3: Secondary Savings ────────────────────────────
     Open: Aug 5, 2026  |  Final: $24,610.50 on Sep 27, 2026

     Chain:
     Aug 05  +  1,000.00  →   1,000.00   (opening transfer)
     Aug 15  +  5,000.00  →   6,000.00   (transfer in)
     Aug 31  +      1.80  →   6,001.80   (interest)
     Sep 05  + 10,000.00  →  16,001.80   (transfer in from checking)
     Sep 12  +  8,000.00  →  24,001.80   (wire in)
     Sep 20  +    605.20  →  24,607.00   (interest credit Sep)
     Sep 27  +      3.50  →  24,610.50   (interest ✓)
  ─────────────────────────────────────────────────────────────── */
  '3': [
    { date:'2026-08-05', desc:'ACCOUNT OPENING TRANSFER FROM ****2001', category:'transfer', deposit:1_000.00,       withdrawal:null,      balance:1_000.00,       status:'Completed' },
    { date:'2026-08-15', desc:'ONLINE TRANSFER FROM ****2001',          category:'transfer', deposit:5_000.00,       withdrawal:null,      balance:6_000.00,       status:'Completed' },
    { date:'2026-08-31', desc:'INTEREST CREDIT',                        category:'interest', deposit:1.80,           withdrawal:null,      balance:6_001.80,       status:'Completed' },
    { date:'2026-09-05', desc:'ONLINE TRANSFER FROM ****2001',          category:'transfer', deposit:10_000.00,      withdrawal:null,      balance:16_001.80,      status:'Completed' },
    { date:'2026-09-12', desc:'WIRE TRANSFER RECEIVED — ACH CREDIT',    category:'transfer', deposit:8_000.00,       withdrawal:null,      balance:24_001.80,      status:'Completed' },
    { date:'2026-09-20', desc:'INTEREST CREDIT',                        category:'interest', deposit:605.20,         withdrawal:null,      balance:24_607.00,      status:'Completed' },
    { date:'2026-09-27', desc:'INTEREST CREDIT',                        category:'interest', deposit:3.50,           withdrawal:null,      balance:24_610.50,      status:'Completed' },
  ],

  /* ── Account 4: Personal Loan ─────────────────────────────────
     Originated: Aug 10, 2026  |  Final balance owed: $97,240.00

     Chain (balance = principal owed, decreases with payments):
     Aug 10  loan originated             → 120,000.00   (principal established)
     Aug 25  − 760.00 first payment      →  99,240.00
     Sep 10  − 760.00 second payment     →  98,480.00
     Sep 20  − 760.00 third payment      →  97,720.00
     Sep 27  − 480.00 extra principal    →  97,240.00   ✓
  ─────────────────────────────────────────────────────────────── */
  '4': [
    { date:'2026-08-10', desc:'LOAN ORIGINATED — HOME IMPROVEMENT',     category:'loan',     deposit:null,           withdrawal:null,      balance:120_000.00,     status:'Completed' },
    { date:'2026-08-25', desc:'LOAN PAYMENT — AUTO DEBIT',              category:'loan',     deposit:null,           withdrawal:760.00,    balance:119_240.00,     status:'Completed' },
    { date:'2026-09-10', desc:'LOAN PAYMENT — AUTO DEBIT',              category:'loan',     deposit:null,           withdrawal:760.00,    balance:118_480.00,     status:'Completed' },
    { date:'2026-09-20', desc:'LOAN PAYMENT — AUTO DEBIT',              category:'loan',     deposit:null,           withdrawal:760.00,    balance:117_720.00,     status:'Completed' },
    { date:'2026-09-27', desc:'EXTRA PRINCIPAL PAYMENT',                category:'loan',     deposit:null,           withdrawal:20_480.00, balance:97_240.00,      status:'Completed' },
  ],

  /* ── Account 5: Cash Rewards Credit Card ─────────────────────
     Opened: Aug 15, 2026  |  Final balance owed: $2,185.43

     Chain (withdrawals = charges, deposits = payments):
     Aug 15  card opened                →       0.00
     Aug 18  − 142.50  Amazon           →     142.50
     Aug 22  − 315.60  Home Depot       →     458.10
     Aug 27  + 458.10  payment          →       0.00
     Sep 03  − 189.44  Costco           →     189.44
     Sep 08  − 412.00  Delta Airlines   →     601.44
     Sep 10  −  29.99  Apple Services   →     631.43
     Sep 15  − 780.00  Best Buy         →   1,411.43
     Sep 17  − 245.60  Home Depot       →   1,657.03
     Sep 20  − 568.99  Shopping         →   2,226.02
     Sep 22  +  40.59  partial payment  →   2,185.43   ✓
  ─────────────────────────────────────────────────────────────── */
  '5': [
    { date:'2026-08-15', desc:'CARD ACCOUNT OPENED',                    category:'deposit',  deposit:null,           withdrawal:null,      balance:0.00,           status:'Completed' },
    { date:'2026-08-18', desc:'AMAZON.COM PURCHASE',                    category:'shopping', deposit:null,           withdrawal:142.50,    balance:142.50,         status:'Completed' },
    { date:'2026-08-22', desc:'HOME DEPOT',                             category:'shopping', deposit:null,           withdrawal:315.60,    balance:458.10,         status:'Completed' },
    { date:'2026-08-27', desc:'PAYMENT RECEIVED — THANK YOU',           category:'payment',  deposit:458.10,         withdrawal:null,      balance:0.00,           status:'Completed' },
    { date:'2026-09-03', desc:'COSTCO WHOLESALE',                       category:'groceries',deposit:null,           withdrawal:189.44,    balance:189.44,         status:'Completed' },
    { date:'2026-09-08', desc:'DELTA AIRLINES',                         category:'travel',   deposit:null,           withdrawal:412.00,    balance:601.44,         status:'Completed' },
    { date:'2026-09-10', desc:'APPLE SERVICES',                         category:'subscr',   deposit:null,           withdrawal:29.99,     balance:631.43,         status:'Completed' },
    { date:'2026-09-15', desc:'BEST BUY',                               category:'shopping', deposit:null,           withdrawal:780.00,    balance:1_411.43,       status:'Completed' },
    { date:'2026-09-17', desc:'HOME DEPOT',                             category:'shopping', deposit:null,           withdrawal:245.60,    balance:1_657.03,       status:'Completed' },
    { date:'2026-09-20', desc:'TARGET STORE',                           category:'shopping', deposit:null,           withdrawal:568.99,    balance:2_226.02,       status:'Completed' },
    { date:'2026-09-22', desc:'PARTIAL PAYMENT — THANK YOU',            category:'payment',  deposit:40.59,          withdrawal:null,      balance:2_185.43,       status:'Completed' },
  ],

  /* ── Account 6: Merrill Edge Brokerage ───────────────────────
     Opened: Aug 20, 2026  |  Final: $61,874.92 on Sep 27, 2026

     Chain:
     Aug 20  + 10,000.00  initial deposit   →  10,000.00
     Aug 22  −  8,800.00  BUY 40×VTI@220    →   1,200.00
     Aug 28  +     42.00  dividend           →   1,242.00
     Sep 05  + 20,000.00  transfer in        →  21,242.00
     Sep 10  −  3,970.40  BUY 8×QQQ@496.30  →  17,271.60
     Sep 15  +  2,528.00  SELL 10×TSLA@252.80→ 19,799.60
     Sep 17  + 38,000.00  large deposit      →  57,799.60
     Sep 20  +    692.50  SELL 5×NVDA@138.50 →  58,492.10
     Sep 22  −    516.60  BUY 3×GOOGL@172.20 →  57,975.50
     Sep 24  +     58.14  dividend           →  58,033.64
     Sep 27  +  3,841.28  appreciation       →  61,874.92  ✓
  ─────────────────────────────────────────────────────────────── */
  '6': [
    { date:'2026-08-20', desc:'ACCOUNT OPENED — INITIAL DEPOSIT',       category:'deposit',  deposit:10_000.00,      withdrawal:null,      balance:10_000.00,      status:'Completed' },
    { date:'2026-08-22', desc:'BUY 40 SHARES — VTI @ $220.00',          category:'trade',    deposit:null,           withdrawal:8_800.00,  balance:1_200.00,       status:'Completed' },
    { date:'2026-08-28', desc:'DIVIDEND — VANGUARD TOTAL STOCK',        category:'dividend', deposit:42.00,          withdrawal:null,      balance:1_242.00,       status:'Completed' },
    { date:'2026-09-05', desc:'TRANSFER FROM SAVINGS ****1001',         category:'transfer', deposit:20_000.00,      withdrawal:null,      balance:21_242.00,      status:'Completed' },
    { date:'2026-09-10', desc:'BUY 8 SHARES — QQQ @ $496.30',           category:'trade',    deposit:null,           withdrawal:3_970.40,  balance:17_271.60,      status:'Completed' },
    { date:'2026-09-15', desc:'SELL 10 SHARES — TSLA @ $252.80',        category:'trade',    deposit:2_528.00,       withdrawal:null,      balance:19_799.60,      status:'Completed' },
    { date:'2026-09-17', desc:'LARGE DEPOSIT — INVESTMENT PROCEEDS',    category:'deposit',  deposit:38_000.00,      withdrawal:null,      balance:57_799.60,      status:'Completed' },
    { date:'2026-09-20', desc:'SELL 5 SHARES — NVDA @ $138.50',         category:'trade',    deposit:692.50,         withdrawal:null,      balance:58_492.10,      status:'Completed' },
    { date:'2026-09-22', desc:'BUY 3 SHARES — GOOGL @ $172.20',         category:'trade',    deposit:null,           withdrawal:516.60,    balance:57_975.50,      status:'Completed' },
    { date:'2026-09-24', desc:'DIVIDEND — VANGUARD TOTAL BOND',         category:'dividend', deposit:58.14,          withdrawal:null,      balance:58_033.64,      status:'Completed' },
    { date:'2026-09-27', desc:'PORTFOLIO APPRECIATION — MARK TO MARKET',category:'dividend', deposit:3_841.28,       withdrawal:null,      balance:61_874.92,      status:'Completed' },
  ],
};

/* ================================================================
   STATEMENT GENERATOR — auto-builds from BOA_TRANSACTIONS
   ================================================================ */
const BOA_STATEMENTS = (function () {
  const grouped = {};
  Object.keys(BOA_TRANSACTIONS).forEach(function (accId) {
    grouped[accId] = {};
    BOA_TRANSACTIONS[accId].forEach(function (t) {
      const ym = t.date.substring(0, 7);
      if (!grouped[accId][ym]) grouped[accId][ym] = [];
      grouped[accId][ym].push(t);
    });
  });

  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

  function lastDay(year, month) { return new Date(year, month, 0).getDate(); }

  function buildStatements(accId) {
    const acc = BOA_ACCOUNTS[accId];
    if (!acc) return {};
    const result = {};
    const months = Object.keys(grouped[accId] || {}).sort().reverse();
    months.forEach(function (ym) {
      const parts  = ym.split('-');
      const year   = parts[0];
      const mon    = parseInt(parts[1], 10);
      const sorted = (grouped[accId][ym] || []).slice()
        .sort(function (a, b) { return a.date.localeCompare(b.date); });
      const closingBal    = sorted[sorted.length - 1].balance;
      const first         = sorted[0];
      const openingBal    = first.deposit != null
        ? first.balance - first.deposit
        : first.balance + (first.withdrawal || 0);
      const totalDeposits    = sorted.reduce(function (s, t) { return s + (t.deposit    || 0); }, 0);
      const totalWithdrawals = sorted.reduce(function (s, t) { return s + (t.withdrawal || 0); }, 0);
      const monName   = MONTH_NAMES[mon - 1];
      const daysInMon = lastDay(parseInt(year, 10), mon);
      if (!result[year]) result[year] = [];
      result[year].push({
        month:            monName + ' ' + year,
        period:           monName + ' 1\u2013' + daysInMon + ', ' + year,
        openingBalance:   openingBal,
        closingBalance:   closingBal,
        totalDeposits:    totalDeposits,
        totalWithdrawals: totalWithdrawals,
        transactions:     sorted.length,
        txnList:          sorted,
      });
    });
    Object.keys(result).forEach(function (yr) {
      result[yr].sort(function (a, b) { return b.month.localeCompare(a.month); });
    });
    return result;
  }

  const all = {};
  Object.keys(BOA_ACCOUNTS).forEach(function (id) { all[id] = buildStatements(id); });
  return all;
})();

/* ================================================================
   SHARED CURRENCY FORMATTER
   ================================================================ */
function boaFmt(n) {
  if (n == null) return '';
  return '$' + Number(n).toLocaleString('en-US', {
    minimumFractionDigits:  2,
    maximumFractionDigits:  2,
  });
}

/* ================================================================
   MONEY MAP — aggregate spending from BOA_TRANSACTIONS
   Uses September 2026 as the featured month (biggest earning month).
   ================================================================ */
const BOA_MONEY_MAP = (function () {
  const YEAR = 2026, MONTH = 9; // September

  const CAT_MAP = {
    housing:   'Housing',
    auto:      'Transport',
    groceries: 'Food & Dining',
    dining:    'Food & Dining',
    utilities: 'Utilities',
    gas:       'Transport',
    subscr:    'Entertainment',
    shopping:  'Shopping',
    travel:    'Travel',
    payment:   null,
    payroll:   null,
    deposit:   null,
    transfer:  null,
    interest:  null,
    loan:      'Loan Payment',
    dividend:  null,
    trade:     null,
    atm:       'ATM / Cash',
  };

  const spending = {};
  let totalIncome = 0;

  Object.keys(BOA_TRANSACTIONS).forEach(function (accId) {
    const acc = BOA_ACCOUNTS[accId];
    BOA_TRANSACTIONS[accId].forEach(function (t) {
      const d = new Date(t.date + 'T00:00:00');
      if (d.getFullYear() !== YEAR || d.getMonth() + 1 !== MONTH) return;

      // Income (payroll + large inbound deposits to savings)
      if ((t.category === 'payroll' || t.category === 'deposit') && t.deposit != null) {
        totalIncome += t.deposit;
        return;
      }

      if (t.withdrawal == null || t.withdrawal <= 0) return;
      if (acc.type === 'credit' && t.category === 'payment') return;

      const group = CAT_MAP[t.category];
      if (!group) return;
      spending[group] = (spending[group] || 0) + t.withdrawal;
    });
  });

  const totalSpending = Object.values(spending).reduce(function (s, v) { return s + v; }, 0);
  const netSavings    = totalIncome - totalSpending;

  // 2-month trend: August vs September
  const TREND_MONTHS = [
    { month: 'Aug', incKey: '2026-08' },
    { month: 'Sep', incKey: '2026-09' },
  ];

  const trend = TREND_MONTHS.map(function (tm) {
    let inc = 0, spd = 0;
    const parts = tm.incKey.split('-').map(Number);
    const yr = parts[0], mo = parts[1];
    Object.keys(BOA_TRANSACTIONS).forEach(function (accId) {
      const acc = BOA_ACCOUNTS[accId];
      BOA_TRANSACTIONS[accId].forEach(function (t) {
        const d = new Date(t.date + 'T00:00:00');
        if (d.getFullYear() !== yr || d.getMonth() + 1 !== mo) return;
        if ((t.category === 'payroll' || t.category === 'deposit') && t.deposit != null) {
          inc += t.deposit;
        }
        if (t.withdrawal != null && t.withdrawal > 0) {
          const grp = CAT_MAP[t.category];
          if (grp) spd += t.withdrawal;
        }
      });
    });
    return { month: tm.month, income: Math.round(inc), spend: Math.round(spd) };
  });

  // Top expenses in September
  const topExp = [];
  Object.keys(BOA_TRANSACTIONS).forEach(function (accId) {
    const acc = BOA_ACCOUNTS[accId];
    BOA_TRANSACTIONS[accId].forEach(function (t) {
      const d = new Date(t.date + 'T00:00:00');
      if (d.getFullYear() !== YEAR || d.getMonth() + 1 !== MONTH) return;
      if (t.withdrawal == null || t.withdrawal <= 0) return;
      if (acc.type === 'credit' && t.category === 'payment') return;
      const grp = CAT_MAP[t.category];
      if (!grp) return;
      topExp.push({
        desc:   t.desc,
        cat:    grp,
        amount: t.withdrawal,
        date:   new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' }),
      });
    });
  });
  topExp.sort(function (a, b) { return b.amount - a.amount; });

  return {
    totalIncome:    totalIncome,
    totalSpending:  totalSpending,
    netSavings:     netSavings,
    spending:       spending,
    trend:          trend,
    topExpenses:    topExp.slice(0, 5),
  };
})();

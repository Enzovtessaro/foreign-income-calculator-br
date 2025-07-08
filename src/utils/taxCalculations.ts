
import { CalculatorData, CalculationResults } from "@/components/Calculator";

// INSS ceiling for 2024 (should be updated annually)
const INSS_CEILING = 7786.02;

// Income tax brackets for 2024
const IRPF_BRACKETS = [
  { min: 0, max: 2259.20, rate: 0, deduction: 0 },
  { min: 2259.21, max: 2826.65, rate: 0.075, deduction: 169.44 },
  { min: 2826.66, max: 3751.05, rate: 0.15, deduction: 381.44 },
  { min: 3751.06, max: 4664.68, rate: 0.225, deduction: 662.77 },
  { min: 4664.69, max: Infinity, rate: 0.275, deduction: 896.00 }
];

// Simples Nacional Anexo V table (for services with Fator R < 28%)
const ANEXO_V_TABLE = [
  { min: 0, max: 180000, rate: 0.155, deduction: 0 },
  { min: 180000.01, max: 360000, rate: 0.18, deduction: 4500 },
  { min: 360000.01, max: 720000, rate: 0.195, deduction: 9900 },
  { min: 720000.01, max: 1800000, rate: 0.205, deduction: 17100 },
  { min: 1800000.01, max: 3600000, rate: 0.23, deduction: 62100 },
  { min: 3600000.01, max: 4800000, rate: 0.305, deduction: 540000 }
];

export function calculateTaxes(data: CalculatorData): CalculationResults {
  // Step 1: Currency conversion
  const grossBRL = data.foreignAmount * data.exchangeRate;
  
  // Step 2: Platform fee (0.5%)
  const platformFee = grossBRL * 0.005;
  const receivedByPJ = grossBRL - platformFee;
  
  // Annual amounts for calculations
  const annualRevenue = receivedByPJ * 12;
  const annualProLabore = data.proLabore * 12;
  
  // Calculate Simples Nacional
  const simplesResults = calculateSimplesNacional(receivedByPJ, annualRevenue, data.proLabore, annualProLabore);
  
  // Calculate Lucro Presumido
  const presumidoResults = calculateLucroPresumido(receivedByPJ, data.proLabore, data.issRate);
  
  return {
    grossBRL,
    platformFee,
    receivedByPJ,
    simplesNacional: simplesResults,
    lucroPresumido: presumidoResults
  };
}

function calculateSimplesNacional(monthlyRevenue: number, annualRevenue: number, monthlyProLabore: number, annualProLabore: number) {
  // Calculate Fator R
  const fatorR = annualRevenue > 0 ? (annualProLabore / annualRevenue) * 100 : 0;
  
  let anexo: string;
  let aliquota: number;
  let pjTax: number;
  
  if (fatorR >= 28) {
    // Anexo III - 6% fixed rate
    anexo = "Anexo III";
    aliquota = 6;
    pjTax = monthlyRevenue * 0.06;
  } else {
    // Anexo V - progressive table
    anexo = "Anexo V";
    const bracket = ANEXO_V_TABLE.find(b => annualRevenue >= b.min && annualRevenue <= b.max);
    if (bracket) {
      aliquota = bracket.rate * 100;
      const annualTax = (annualRevenue * bracket.rate) - bracket.deduction;
      pjTax = Math.max(0, annualTax / 12);
    } else {
      aliquota = 15.5;
      pjTax = monthlyRevenue * 0.155;
    }
  }
  
  // Calculate PF taxes (INSS + IRPF on pro-labore)
  const pfTax = calculatePFTaxes(monthlyProLabore);
  
  const netAmount = monthlyRevenue - pjTax - pfTax;
  
  return {
    pjTax,
    pfTax,
    netAmount,
    fatorR,
    anexo,
    aliquota
  };
}

function calculateLucroPresumido(monthlyRevenue: number, monthlyProLabore: number, issRate: number) {
  // PIS and COFINS are zero for service exports
  const presumedProfit = monthlyRevenue * 0.32; // 32% presumed profit
  
  // IRPJ: 15% on presumed profit + 10% on excess over R$ 20,000
  const irpjBase = presumedProfit;
  const irpj15 = irpjBase * 0.15;
  const irpj10 = Math.max(0, (irpjBase - 20000) * 0.10);
  const irpj = irpj15 + irpj10;
  
  // CSLL: 9% on presumed profit
  const csll = presumedProfit * 0.09;
  
  // ISS: rate on total revenue
  const iss = monthlyRevenue * (issRate / 100);
  
  const pjTax = irpj + csll + iss;
  
  // PF taxes depend on whether there's pro-labore or just profit distribution
  let pfTax = 0;
  if (monthlyProLabore > 0) {
    pfTax = calculatePFTaxes(monthlyProLabore);
  }
  // If no pro-labore, assume profit distribution (tax-free for individuals)
  
  const netAmount = monthlyRevenue - pjTax - pfTax;
  
  return {
    pjTax,
    pfTax,
    netAmount,
    irpj,
    csll,
    iss
  };
}

function calculatePFTaxes(monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  
  // INSS: 11% up to ceiling
  const inssBase = Math.min(monthlyIncome, INSS_CEILING);
  const inss = inssBase * 0.11;
  
  // IRPF: progressive table
  const irpfBase = monthlyIncome - inss;
  const bracket = IRPF_BRACKETS.find(b => irpfBase >= b.min && irpfBase <= b.max);
  
  let irpf = 0;
  if (bracket && bracket.rate > 0) {
    irpf = Math.max(0, (irpfBase * bracket.rate) - bracket.deduction);
  }
  
  return inss + irpf;
}

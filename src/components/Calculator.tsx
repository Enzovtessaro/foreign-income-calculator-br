
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputForm } from "./calculator/InputForm";
import { CalculationBreakdown } from "./calculator/CalculationBreakdown";
import { calculateTaxes } from "@/utils/taxCalculations";
import { convertCurrency } from "@/utils/currencyUtils";
import { toast } from "@/hooks/use-toast";

export interface CalculatorData {
  foreignAmount: number;
  currency: string;
  exchangeRate: number;
  proLabore: number;
  municipality: string;
  issRate: number;
  contributeINSS: boolean;
}

export interface CalculationResults {
  grossBRL: number;
  platformFee: number;
  receivedByPJ: number;
  simplesNacional: {
    pjTax: number;
    pfTax: number;
    netAmount: number;
    fatorR: number;
    anexo: string;
    aliquota: number;
  };
  lucroPresumido: {
    pjTax: number;
    pfTax: number;
    netAmount: number;
    irpj: number;
    csll: number;
    iss: number;
  };
}

export const Calculator = () => {
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    foreignAmount: 0,
    currency: "USD",
    exchangeRate: 0,
    proLabore: 0,
    municipality: "",
    issRate: 2,
    contributeINSS: false,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (data: CalculatorData) => {
    setLoading(true);
    
    try {
      // Sempre buscar a taxa de câmbio automaticamente
      const rate = await convertCurrency(data.currency);
      const finalData = { ...data, exchangeRate: rate };

      const calculationResults = calculateTaxes(finalData);
      setCalculatorData(finalData);
      setResults(calculationResults);
      
      toast({
        title: "Cálculo realizado com sucesso!",
        description: "Confira os resultados abaixo.",
      });
    } catch (error) {
      console.error("Erro no cálculo:", error);
      toast({
        title: "Erro no cálculo",
        description: "Verifique os dados informados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
            <CardTitle className="text-3xl text-center font-bold">
              Calculadora de Impostos PJ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <InputForm onCalculate={handleCalculate} loading={loading} />
          </CardContent>
        </Card>

        {results && (
          <CalculationBreakdown results={results} data={calculatorData} />
        )}
      </div>
    </div>
  );
};


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputForm } from "./calculator/InputForm";
import { ResultsDisplay } from "./calculator/ResultsDisplay";
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
    issRate: 5,
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
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center">
            Calculadora de Impostos PJ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <InputForm onCalculate={handleCalculate} loading={loading} />
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100">
            <TabsTrigger value="results" className="text-lg py-3">
              Resultados
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="text-lg py-3">
              Detalhamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            <ResultsDisplay results={results} data={calculatorData} />
          </TabsContent>

          <TabsContent value="breakdown">
            <CalculationBreakdown results={results} data={calculatorData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

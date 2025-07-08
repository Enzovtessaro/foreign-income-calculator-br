
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, DollarSign, Building2, User } from "lucide-react";
import { CalculatorData } from "../Calculator";

interface InputFormProps {
  onCalculate: (data: CalculatorData) => void;
  loading: boolean;
}

export const InputForm = ({ onCalculate, loading }: InputFormProps) => {
  const [formData, setFormData] = useState<CalculatorData>({
    foreignAmount: 0,
    currency: "USD",
    exchangeRate: 0,
    proLabore: 0,
    municipality: "",
    issRate: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const currencies = [
    { value: "USD", label: "Dólar Americano (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "Libra Esterlina (GBP)" },
    { value: "CAD", label: "Dólar Canadense (CAD)" },
    { value: "AUD", label: "Dólar Australiano (AUD)" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Foreign Income Section */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">
                Valor Contratado
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="foreignAmount">Valor em Moeda Estrangeira</Label>
                <Input
                  id="foreignAmount"
                  type="number"
                  step="0.01"
                  value={formData.foreignAmount || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    foreignAmount: parseFloat(e.target.value) || 0
                  }))}
                  className="text-lg"
                  required
                />
              </div>

              <div>
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    currency: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="exchangeRate">
                  Taxa de Câmbio (deixe 0 para buscar automaticamente)
                </Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  value={formData.exchangeRate || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    exchangeRate: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="Ex: 5.2500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PJ Configuration Section */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">
                Configuração da PJ
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="proLabore">Pró-Labore Mensal (R$)</Label>
                <Input
                  id="proLabore"
                  type="number"
                  step="0.01"
                  value={formData.proLabore || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    proLabore: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="Ex: 3000.00"
                />
              </div>

              <div>
                <Label htmlFor="municipality">Município (opcional)</Label>
                <Input
                  id="municipality"
                  value={formData.municipality}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    municipality: e.target.value
                  }))}
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div>
                <Label htmlFor="issRate">Taxa ISS (%)</Label>
                <Select
                  value={formData.issRate.toString()}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    issRate: parseFloat(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2% - Taxa mínima</SelectItem>
                    <SelectItem value="3">3%</SelectItem>
                    <SelectItem value="4">4%</SelectItem>
                    <SelectItem value="5">5% - Taxa padrão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-12 py-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Impostos
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

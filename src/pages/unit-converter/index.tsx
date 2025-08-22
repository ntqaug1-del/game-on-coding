import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getExchangeRates, convertCurrency } from '@/lib/services/currencyService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';

// Define unit types and their conversion factors
const unitTypes = {
  length: {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    inches: 0.0254,
    feet: 0.3048,
    yards: 0.9144,
    miles: 1609.34
  },
  mass: {
    grams: 1,
    kilograms: 1000,
    milligrams: 0.001,
    pounds: 453.592,
    ounces: 28.3495
  },
  temperature: {
    celsius: 'celsius',
    fahrenheit: 'fahrenheit',
    kelvin: 'kelvin'
  },
  currency: {
    USD: 'USD',
    EUR: 'EUR',
    GBP: 'GBP',
    JPY: 'JPY',
    AUD: 'AUD',
    CAD: 'CAD',
    CHF: 'CHF',
    CNY: 'CNY',
    INR: 'INR',
    SGD: 'SGD',
    VND: 'VND'
  }
};

const UnitConverter: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>('currency');
  const [fromUnit, setFromUnit] = useState<string>('USD');
  const [toUnit, setToUnit] = useState<string>('EUR');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (selectedType === 'currency') {
      fetchExchangeRates();
    }
  }, [selectedType]);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const rates = await getExchangeRates('USD');
      setExchangeRates(rates.conversion_rates);
    } catch (error) {
      setError('Failed to fetch exchange rates');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (type: string) => {
    setSelectedType(type);
    setInputValue('');
    setResult('');
    setError('');
    
    // Set default units based on type
    switch(type) {
      case 'currency':
        setFromUnit('USD');
        setToUnit('EUR');
        break;
      case 'length':
        setFromUnit('meters');
        setToUnit('kilometers');
        break;
      case 'mass':
        setFromUnit('grams');
        setToUnit('kilograms');
        break;
      case 'temperature':
        setFromUnit('celsius');
        setToUnit('fahrenheit');
        break;
    }
  };

  const handleConvert = async () => {
    setError('');
    setResult('');

    if (!inputValue) {
      setError('Please enter a value');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }

    if (selectedType === 'temperature') {
      convertTemperature(value);
    } else if (selectedType === 'currency') {
      try {
        setLoading(true);
        const convertedValue = await convertCurrency(fromUnit, toUnit, value);
        setResult(convertedValue.toFixed(2));
      } catch (error) {
        setError('Failed to convert currency');
      } finally {
        setLoading(false);
      }
    } else {
      convertStandard(value);
    }
  };

  const convertStandard = (value: number) => {
    const fromFactor = unitTypes[selectedType as keyof typeof unitTypes][fromUnit as keyof typeof unitTypes['length']];
    const toFactor = unitTypes[selectedType as keyof typeof unitTypes][toUnit as keyof typeof unitTypes['length']];
    
    const result = (value * fromFactor) / toFactor;
    setResult(result.toFixed(6));
  };

  const convertTemperature = (value: number) => {
    let result: number;
    
    if (fromUnit === 'celsius') {
      if (toUnit === 'fahrenheit') {
        result = (value * 9/5) + 32;
      } else if (toUnit === 'kelvin') {
        result = value + 273.15;
      } else {
        result = value;
      }
    } else if (fromUnit === 'fahrenheit') {
      if (toUnit === 'celsius') {
        result = (value - 32) * 5/9;
      } else if (toUnit === 'kelvin') {
        result = (value - 32) * 5/9 + 273.15;
      } else {
        result = value;
      }
    } else { // kelvin
      if (toUnit === 'celsius') {
        result = value - 273.15;
      } else if (toUnit === 'fahrenheit') {
        result = (value - 273.15) * 9/5 + 32;
      } else {
        result = value;
      }
    }
    
    setResult(result.toFixed(2));
  };

  const handleFromUnitChange = (value: string) => {
    setFromUnit(value);
    setInputValue('');
    setResult('');
    setError('');
  };

  const handleToUnitChange = (value: string) => {
    setToUnit(value);
    setInputValue('');
    setResult('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-4 sm:mb-6">
            <Button asChild variant="ghost" className="mb-4 sm:mb-8 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg transform hover:scale-[1.02] transition-all duration-200">
              <Link to="/" className="flex items-center gap-2">
                <FaArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="bg-white/80 rounded-xl p-4 sm:p-8 shadow-lg max-w-4xl mx-auto backdrop-blur-md border border-purple-100">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 mr-3 sm:mr-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-md">
                    <Scale className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Unit Converter</h1>
                  <p className="text-purple-700">Convert between different units of measurement</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-purple-50">
                      <Info className="h-4 w-4 text-purple-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select a unit type and enter a value to convert</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue={selectedType} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-purple-50 p-1 rounded-lg">
                <TabsTrigger 
                  value="currency"
                  onClick={() => handleTabChange('currency')}
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
                >
                  Currency
                </TabsTrigger>
                <TabsTrigger 
                  value="length" 
                  onClick={() => handleTabChange('length')}
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
                >
                  Length
                </TabsTrigger>
                <TabsTrigger 
                  value="mass"
                  onClick={() => handleTabChange('mass')}
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
                >
                  Mass
                </TabsTrigger>
                <TabsTrigger 
                  value="temperature"
                  onClick={() => handleTabChange('temperature')}
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
                >
                  Temperature
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedType}>
                <Card className="border-2 border-purple-100 shadow-sm">
                  <CardHeader className="bg-purple-50 rounded-t-lg">
                    <CardTitle className="text-xl font-semibold text-purple-900">Convert {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</CardTitle>
                    <CardDescription className="text-purple-600">
                      Enter a value and select the units to convert between
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
                      <div>
                        <label className="text-base sm:text-lg font-medium mb-2 block text-purple-700">
                          From
                        </label>
                        <Select
                          value={fromUnit}
                          onValueChange={handleFromUnitChange}
                        >
                          <SelectTrigger className="h-12 text-base border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-purple-200 shadow-lg">
                            {Object.keys(unitTypes[selectedType as keyof typeof unitTypes]).map((unit) => (
                              <SelectItem 
                                key={unit} 
                                value={unit}
                                className="hover:bg-purple-50 focus:bg-purple-50"
                              >
                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-base sm:text-lg font-medium mb-2 block text-purple-700">
                          To
                        </label>
                        <Select
                          value={toUnit}
                          onValueChange={handleToUnitChange}
                        >
                          <SelectTrigger className="h-12 text-base border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-purple-200 shadow-lg">
                            {Object.keys(unitTypes[selectedType as keyof typeof unitTypes]).map((unit) => (
                              <SelectItem 
                                key={unit} 
                                value={unit}
                                className="hover:bg-purple-50 focus:bg-purple-50"
                              >
                                {unit.charAt(0).toUpperCase() + unit.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-base sm:text-lg font-medium mb-2 block text-purple-700">
                        Value
                      </label>
                      <Input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter value in ${fromUnit}`}
                        className="h-12 text-base border-2 border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>

                    <Button
                      onClick={handleConvert}
                      disabled={loading}
                      className="w-full h-14 text-base sm:text-lg rounded-xl shadow-lg transition-all duration-200 transform bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Converting...
                        </div>
                      ) : (
                        <>
                          <FaExchangeAlt className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Convert
                        </>
                      )}
                    </Button>

                    {result && (
                      <div className="mt-6 sm:mt-8 p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border-2 border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg sm:text-xl font-semibold text-purple-800">
                            Conversion Result
                          </h2>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-inner">
                          <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                            {result} {toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UnitConverter;

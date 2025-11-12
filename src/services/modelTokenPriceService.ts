import modelTokenPriceData from '../data/modelTokenPrice.json';

export interface ModelTokenPrice {
  id: string;
  provider: string;
  model: string;
  variant: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion: number | null;
  hasCaching: boolean;
  contextWindow: number;
  notes: string;
}

export class ModelTokenPriceService {
  /**
   * Get all model token prices
   */
  static async getModelTokenPrices(): Promise<ModelTokenPrice[]> {
    return modelTokenPriceData as ModelTokenPrice[];
  }

  /**
   * Get model price by ID
   */
  static async getModelPriceById(id: string): Promise<ModelTokenPrice | undefined> {
    const prices = await this.getModelTokenPrices();
    return prices.find(price => price.id === id);
  }

  /**
   * Get model prices by provider
   */
  static async getModelPricesByProvider(provider: string): Promise<ModelTokenPrice[]> {
    const prices = await this.getModelTokenPrices();
    return prices.filter(price => 
      price.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  /**
   * Get model prices by model name
   */
  static async getModelPricesByModel(modelName: string): Promise<ModelTokenPrice[]> {
    const prices = await this.getModelTokenPrices();
    return prices.filter(price => 
      price.model.toLowerCase().includes(modelName.toLowerCase())
    );
  }

  /**
   * Find best matching model price by model string
   */
  static async findModelPrice(modelString: string): Promise<ModelTokenPrice | null> {
    const prices = await this.getModelTokenPrices();
    const lowerModelString = modelString.toLowerCase();
    
    // Try exact match first
    let match = prices.find(price => 
      price.model.toLowerCase() === lowerModelString ||
      price.id.toLowerCase() === lowerModelString
    );
    
    if (match) return match;
    
    // Try partial matches with priority order
    const searchTerms = [
      'gpt-5',
      'gpt-5-mini', 
      'gpt-5-nano',
      'gpt-3.5-turbo',
      'gemini-2.0',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'claude-sonnet-4',
      'claude-haiku',
      'claude-opus-4',
      'claude-opus-3',
      'deepseek-r1',
      'deepseek'
    ];
    
    for (const term of searchTerms) {
      if (lowerModelString.includes(term)) {
        match = prices.find(price => price.id.includes(term));
        if (match) return match;
      }
    }
    
    // Fallback to provider matching
    if (lowerModelString.includes('openai') || lowerModelString.includes('gpt')) {
      return prices.find(price => price.provider === 'OpenAI') || null;
    }
    
    if (lowerModelString.includes('google') || lowerModelString.includes('gemini')) {
      return prices.find(price => price.provider === 'Google') || null;
    }
    
    if (lowerModelString.includes('anthropic') || lowerModelString.includes('claude')) {
      return prices.find(price => price.provider === 'Anthropic') || null;
    }
    
    if (lowerModelString.includes('deepseek')) {
      return prices.find(price => price.provider === 'DeepSeek') || null;
    }
    
    return null;
  }

  /**
   * Calculate token cost for a specific model
   */
  static async calculateTokenCost(
    modelString: string,
    inputTokens: number,
    outputTokens: number,
    useCaching: boolean = false
  ): Promise<{
    modelPrice: ModelTokenPrice | null;
    inputCost: number;
    outputCost: number;
    totalCost: number;
    costPerToken: number;
    breakdown: {
      inputCostPerToken: number;
      outputCostPerToken: number;
      cachingUsed: boolean;
    };
  }> {
    const modelPrice = await this.findModelPrice(modelString);
    
    if (!modelPrice) {
      return {
        modelPrice: null,
        inputCost: 0,
        outputCost: 0,
        totalCost: 0,
        costPerToken: 0,
        breakdown: {
          inputCostPerToken: 0,
          outputCostPerToken: 0,
          cachingUsed: false
        }
      };
    }

    // Determine input price (use cached price if available and requested)
    const inputPricePerMillion = (useCaching && modelPrice.hasCaching && modelPrice.cachedInputPricePerMillion) 
      ? modelPrice.cachedInputPricePerMillion 
      : modelPrice.inputPricePerMillion;

    // Calculate costs
    const inputCost = (inputTokens / 1000000) * inputPricePerMillion;
    const outputCost = (outputTokens / 1000000) * modelPrice.outputPricePerMillion;
    const totalCost = inputCost + outputCost;
    const totalTokens = inputTokens + outputTokens;
    const costPerToken = totalTokens > 0 ? totalCost / totalTokens : 0;

    return {
      modelPrice,
      inputCost: Math.round(inputCost * 1000000) / 1000000, // Round to 6 decimal places
      outputCost: Math.round(outputCost * 1000000) / 1000000,
      totalCost: Math.round(totalCost * 1000000) / 1000000,
      costPerToken: Math.round(costPerToken * 1000000) / 1000000,
      breakdown: {
        inputCostPerToken: inputTokens > 0 ? inputCost / inputTokens : 0,
        outputCostPerToken: outputTokens > 0 ? outputCost / outputTokens : 0,
        cachingUsed: useCaching && modelPrice.hasCaching && !!modelPrice.cachedInputPricePerMillion
      }
    };
  }

  /**
   * Get all unique providers
   */
  static async getProviders(): Promise<string[]> {
    const prices = await this.getModelTokenPrices();
    return [...new Set(prices.map(price => price.provider))].sort();
  }

  /**
   * Get all unique models
   */
  static async getModels(): Promise<string[]> {
    const prices = await this.getModelTokenPrices();
    return [...new Set(prices.map(price => price.model))].sort();
  }

  /**
   * Get pricing comparison across providers
   */
  static async getPricingComparison(): Promise<{
    provider: string;
    models: number;
    avgInputPrice: number;
    avgOutputPrice: number;
    cheapestModel: string;
    mostExpensiveModel: string;
  }[]> {
    const prices = await this.getModelTokenPrices();
    const providers = await this.getProviders();
    
    return providers.map(provider => {
      const providerPrices = prices.filter(price => price.provider === provider);
      const avgInputPrice = providerPrices.reduce((sum, price) => sum + price.inputPricePerMillion, 0) / providerPrices.length;
      const avgOutputPrice = providerPrices.reduce((sum, price) => sum + price.outputPricePerMillion, 0) / providerPrices.length;
      
      const sortedByInput = [...providerPrices].sort((a, b) => a.inputPricePerMillion - b.inputPricePerMillion);
      const cheapestModel = sortedByInput[0]?.model || 'N/A';
      const mostExpensiveModel = sortedByInput[sortedByInput.length - 1]?.model || 'N/A';
      
      return {
        provider,
        models: providerPrices.length,
        avgInputPrice: Math.round(avgInputPrice * 100) / 100,
        avgOutputPrice: Math.round(avgOutputPrice * 100) / 100,
        cheapestModel,
        mostExpensiveModel
      };
    });
  }

  /**
   * Get cost-effective model recommendations
   */
  static async getCostEffectiveRecommendations(
    expectedInputTokens: number,
    expectedOutputTokens: number,
    useCaching: boolean = false
  ): Promise<{
    model: string;
    provider: string;
    estimatedCost: number;
    costPerToken: number;
    savings: number;
  }[]> {
    const prices = await this.getModelTokenPrices();
    
    const recommendations = await Promise.all(
      prices.map(async (price) => {
        const calculation = await this.calculateTokenCost(
          price.model,
          expectedInputTokens,
          expectedOutputTokens,
          useCaching
        );
        
        return {
          model: price.model,
          provider: price.provider,
          estimatedCost: calculation.totalCost,
          costPerToken: calculation.costPerToken,
          savings: 0 // Will be calculated below
        };
      })
    );
    
    // Sort by cost and calculate savings compared to most expensive
    recommendations.sort((a, b) => a.estimatedCost - b.estimatedCost);
    const mostExpensive = recommendations[recommendations.length - 1];
    
    recommendations.forEach(rec => {
      rec.savings = mostExpensive.estimatedCost - rec.estimatedCost;
    });
    
    return recommendations;
  }

  /**
   * Search models by name or provider
   */
  static async searchModels(query: string): Promise<ModelTokenPrice[]> {
    const prices = await this.getModelTokenPrices();
    const lowerQuery = query.toLowerCase();
    return prices.filter(price => 
      price.model.toLowerCase().includes(lowerQuery) ||
      price.provider.toLowerCase().includes(lowerQuery) ||
      price.variant.toLowerCase().includes(lowerQuery) ||
      price.notes.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get models with caching support
   */
  static async getModelsWithCaching(): Promise<ModelTokenPrice[]> {
    const prices = await this.getModelTokenPrices();
    return prices.filter(price => price.hasCaching);
  }

  /**
   * Get pricing statistics
   */
  static async getPricingStatistics(): Promise<{
    totalModels: number;
    avgInputPrice: number;
    avgOutputPrice: number;
    cheapestInputPrice: number;
    mostExpensiveInputPrice: number;
    cheapestOutputPrice: number;
    mostExpensiveOutputPrice: number;
    modelsWithCaching: number;
  }> {
    const prices = await this.getModelTokenPrices();
    
    if (prices.length === 0) {
      return {
        totalModels: 0,
        avgInputPrice: 0,
        avgOutputPrice: 0,
        cheapestInputPrice: 0,
        mostExpensiveInputPrice: 0,
        cheapestOutputPrice: 0,
        mostExpensiveOutputPrice: 0,
        modelsWithCaching: 0
      };
    }

    const inputPrices = prices.map(price => price.inputPricePerMillion);
    const outputPrices = prices.map(price => price.outputPricePerMillion);
    
    return {
      totalModels: prices.length,
      avgInputPrice: Math.round((inputPrices.reduce((sum, price) => sum + price, 0) / prices.length) * 100) / 100,
      avgOutputPrice: Math.round((outputPrices.reduce((sum, price) => sum + price, 0) / prices.length) * 100) / 100,
      cheapestInputPrice: Math.min(...inputPrices),
      mostExpensiveInputPrice: Math.max(...inputPrices),
      cheapestOutputPrice: Math.min(...outputPrices),
      mostExpensiveOutputPrice: Math.max(...outputPrices),
      modelsWithCaching: prices.filter(price => price.hasCaching).length
    };
  }

  /**
   * Filter models by price range
   */
  static async filterModelsByPriceRange(
    minInputPrice?: number,
    maxInputPrice?: number,
    minOutputPrice?: number,
    maxOutputPrice?: number
  ): Promise<ModelTokenPrice[]> {
    const prices = await this.getModelTokenPrices();
    
    return prices.filter(price => {
      const inputInRange = (minInputPrice === undefined || price.inputPricePerMillion >= minInputPrice) &&
                          (maxInputPrice === undefined || price.inputPricePerMillion <= maxInputPrice);
      
      const outputInRange = (minOutputPrice === undefined || price.outputPricePerMillion >= minOutputPrice) &&
                           (maxOutputPrice === undefined || price.outputPricePerMillion <= maxOutputPrice);
      
      return inputInRange && outputInRange;
    });
  }
}
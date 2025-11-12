export interface ExtractedInvoiceData {
  vendorName: string;
  poNumber: string;
  invoiceNumber: string;
  amountBeforeTax: number;
  taxBaseAmount: number;
  taxBaseAmount: number;
  tax: number;
  amountAfterTax: number;
  dueDate: string;
  confidence: number; // 0-100 confidence score
  extractionNotes?: string;
  missingFields?: string[]; // Fields that were missing or invalid
  warnings?: string[]; // Warnings about data quality
}

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedInvoiceData;
  error?: string;
  processingTime?: number;
}

export class AiInvoiceExtractService {
  private static readonly GEMINI_API_KEY = 'AIzaSyD1S4r1Xz-7E2f8RyQFEehmzuHa7ZrINMM';
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  /**
   * Extract invoice data from uploaded PDF file using Gemini AI
   */
  static async extractInvoiceData(file: File): Promise<ExtractionResult> {
    const startTime = Date.now();
    
    try {
      console.group('🤖 [AI INVOICE EXTRACT] Starting extraction');
      console.log('📄 File:', file.name, file.size, file.type);

      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      console.log('✅ File converted to base64');

      // Call Gemini API for extraction
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant specialized in extracting invoice data from PDF documents. 

Please analyze the uploaded invoice document and extract the following information:

1. Vendor Name (usually in the header or top section of the invoice)
2. PO Number (Purchase Order number, may be labeled as "PO #", "Purchase Order", "PO Number")
3. Invoice Number (may be labeled as "Invoice #", "Invoice Number", "Invoice No")
4. Amount Before Tax (subtotal before any tax is applied)
5. Tax Base Amount (the base amount on which tax is calculated, may be labeled as "Tax Base", "Taxable Amount", "Base Amount")
6. Tax (tax amount, may be VAT, GST, or other tax types)
7. Amount After Tax (total amount including tax)
8. Due Date (payment due date, may be labeled as "Due Date", "Payment Due", "Net Terms")

Important extraction guidelines:
- Look for currency symbols (IDR, USD, $, Rp) and extract numeric values
- For dates, convert to YYYY-MM-DD format
- If PO number is not found, return "N/A"
- If any field is unclear or not found, indicate in the confidence score
- Provide a confidence score (0-100) based on how clear the extracted data is

Return the data in this exact JSON format:
{
  "vendorName": "string",
  "poNumber": "string", 
  "invoiceNumber": "string",
  "amountBeforeTax": number,
  "taxBaseAmount": number,
  "tax": number,
  "amountAfterTax": number,
  "dueDate": "YYYY-MM-DD",
  "confidence": number,
  "extractionNotes": "string (optional notes about extraction quality)"
}

If you cannot extract the data or the document is not an invoice, return:
{
  "error": "Description of the issue"
}`
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Gemini API response received');

      if (data && Array.isArray(data.candidates) && data.candidates.length > 0 && data.candidates[0] && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text;
        console.log('📝 Raw response text:', text);

        // Extract JSON from response
        const jsonStr = this.extractJSONFromResponse(text);
        if (jsonStr) {
          try {
            const extractedData = JSON.parse(jsonStr);
            console.log('🎯 Extracted data:', extractedData);

            // Check if extraction was successful
            if (extractedData.error) {
              console.log('❌ Extraction failed:', extractedData.error);
              console.groupEnd();
              return {
                success: false,
                error: extractedData.error,
                processingTime: Date.now() - startTime
              };
            }

            // Validate extracted data
            const validationResult = this.validateExtractedData(extractedData);
            
            // Add validation results to extracted data
            extractedData.missingFields = validationResult.missingFields;
            extractedData.warnings = validationResult.warnings;
            
            if (!validationResult.isValid) {
              console.log('❌ Critical validation failed:', validationResult.errors);
              console.groupEnd();
              return {
                success: false,
                error: `Data validation failed: ${validationResult.errors.join(', ')}`,
                processingTime: Date.now() - startTime
              };
            }

            if (validationResult.warnings.length > 0) {
              console.log('⚠️ Extraction completed with warnings:', validationResult.warnings);
            } else {
              console.log('✅ Extraction completed successfully');
            }
            console.groupEnd();
            return {
              success: true,
              data: extractedData as ExtractedInvoiceData,
              processingTime: Date.now() - startTime
            };

          } catch (parseError) {
            console.error('❌ Error parsing extracted JSON:', parseError);
            console.log('📄 Raw JSON string:', jsonStr);
            console.groupEnd();
            return {
              success: false,
              error: 'Failed to parse extracted data',
              processingTime: Date.now() - startTime
            };
          }
        } else {
          console.log('❌ No JSON found in response');
          console.groupEnd();
          return {
            success: false,
            error: 'No structured data found in document',
            processingTime: Date.now() - startTime
          };
        }
      } else {
        console.log('❌ Invalid API response structure');
        console.groupEnd();
        return {
          success: false,
          error: 'Invalid response from AI service',
          processingTime: Date.now() - startTime
        };
      }

    } catch (error) {
      console.error('❌ Error during extraction:', error);
      console.groupEnd();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Convert file to base64 string
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          // Remove data URL prefix to get just the base64 data
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Extract JSON from Gemini response text
   */
  private static extractJSONFromResponse(text: string): string | null {
    // First, check for JSON within markdown code blocks
    const markdownJsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownJsonMatch) {
      return markdownJsonMatch[1].trim();
    }
    
    // Check for JSON within generic code blocks
    const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      const content = codeBlockMatch[1].trim();
      // Check if the content looks like JSON (starts with { and ends with })
      if (content.startsWith('{') && content.endsWith('}')) {
        return content;
      }
    }
    
    // Fall back to extracting content between first and last curly braces
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0].trim();
    }
    
    return null;
  }

  /**
   * Validate extracted invoice data
   */
  private static validateExtractedData(data: any): { isValid: boolean; errors: string[]; warnings: string[]; missingFields: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingFields: string[] = [];

    // Check required fields
    if (!data.vendorName || typeof data.vendorName !== 'string') {
      missingFields.push('vendorName');
      warnings.push('Vendor name is missing or invalid');
    }
    
    if (!data.invoiceNumber || typeof data.invoiceNumber !== 'string') {
      missingFields.push('invoiceNumber');
      warnings.push('Invoice number is missing or invalid');
    }
    
    if (typeof data.amountBeforeTax !== 'number' || data.amountBeforeTax < 0) {
      missingFields.push('amountBeforeTax');
      warnings.push('Amount before tax is missing or invalid');
    }
    
    if (typeof data.taxBaseAmount !== 'number' || data.taxBaseAmount < 0) {
      missingFields.push('taxBaseAmount');
      warnings.push('Tax base amount is missing or invalid');
    }
    
    if (typeof data.tax !== 'number' || data.tax < 0) {
      missingFields.push('tax');
      warnings.push('Tax amount is missing or invalid');
    }
    
    if (typeof data.amountAfterTax !== 'number' || data.amountAfterTax < 0) {
      missingFields.push('amountAfterTax');
      warnings.push('Amount after tax is missing or invalid');
    }
    
    if (!data.dueDate || typeof data.dueDate !== 'string') {
      missingFields.push('dueDate');
      warnings.push('Due date is missing or invalid');
    } else {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.dueDate)) {
        missingFields.push('dueDate');
        warnings.push('Due date format is invalid (should be YYYY-MM-DD)');
      }
    }
    
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 100) {
      missingFields.push('confidence');
      warnings.push('Confidence score is missing or invalid');
    }

    // Validate amount calculations
    if (missingFields.length === 0) {
      const calculatedTotal = data.taxBaseAmount + data.tax;
      const tolerance = 0.01; // Allow small rounding differences
      
      if (Math.abs(calculatedTotal - data.amountAfterTax) > tolerance) {
        errors.push('Amount calculations do not match (tax base + tax ≠ after tax)');
      }
    }

    return {
      isValid: errors.length === 0, // Only critical calculation errors prevent processing
      errors,
      warnings,
      missingFields
    };
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currency: string = 'IDR'): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Format date for display
   */
  static formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Calculate tax percentage
   */
  static calculateTaxPercentage(taxBaseAmount: number, tax: number): number {
    if (taxBaseAmount === 0) return 0;
    return Math.round((tax / taxBaseAmount) * 100 * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Validate PO number format (optional validation)
   */
  static validatePONumber(poNumber: string): boolean {
    if (poNumber === 'N/A' || poNumber === '') return true;
    
    // Basic PO number validation (adjust based on your organization's format)
    const poRegex = /^[A-Z0-9\-_]{3,20}$/i;
    return poRegex.test(poNumber);
  }

  /**
   * Get confidence level description
   */
  static getConfidenceDescription(confidence: number): string {
    if (confidence >= 90) return 'High confidence - data appears accurate';
    if (confidence >= 70) return 'Medium confidence - please review extracted data';
    if (confidence >= 50) return 'Low confidence - manual verification recommended';
    return 'Very low confidence - manual entry may be more reliable';
  }

  /**
   * Get confidence color for UI display
   */
  static getConfidenceColor(confidence: number): string {
    if (confidence >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50';
    if (confidence >= 50) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/50';
    return 'text-red-600 bg-red-100 dark:bg-red-900/50';
  }
}
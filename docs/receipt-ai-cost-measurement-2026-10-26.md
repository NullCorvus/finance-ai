# Measured AI cost for receipt capture

Measured on 26 October 2026 using the receipt preprocessing and provider gateways from backend commit `6c7c9fc`, which matched the deployed Cloud Run image at the time. The test used a synthetic 1,200 × 1,800 receipt containing three items and a COP 19,000 total. The image was converted to JPEG at quality 85 by the application preprocessor. No personal data or financial transaction was created.

The test called the same application gateway locally with the models and API configuration used by Cloud Run. It did not execute the deployed HTTP receipt endpoint, so it excludes endpoint, database and network charges and is not an end-to-end cost measurement. The application gateway does not persist provider token usage; the test observed the provider response locally without changing production code.

| Provider | Model | Input tokens | Cached input tokens | Uncached input tokens | Output tokens | Response |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| DeepSeek | `deepseek-flash` | 1,409 | 128 | 1,281 | 187 | HTTP 200; one call |
| Google | `gemini-3.5-flash-lite` | 1,504 | Not reported | Not reported | 274 | HTTP 200; one call |

## Cost of this specific measurement

At the time of this test DeepSeek's published off-peak prices were $0.003 per million cached input tokens, $0.15 per million uncached input tokens and $0.60 per million output tokens. The measured call was made during the published off-peak window:

`(128 × 0.003 + 1,281 × 0.15 + 187 × 0.60) / 1,000,000 = $0.000304734`

That is approximately **$0.000305 for this one DeepSeek call**, or **$0.305 for 1,000 identical calls**, before other platform charges. This is a calculation from returned token usage and published prices, not a billing invoice or proof of the exact account deduction. Peak prices are twice those off-peak prices.

Gemini's standard paid price was $0.30 per million input tokens and $2.50 per million output tokens, including thinking tokens. If this request is billed at those paid rates:

`(1,504 × 0.30 + 274 × 2.50) / 1,000,000 = $0.0011362`

That is approximately **$0.001136 for this one Gemini call**, or **$1.136 for 1,000 identical calls**, before other platform charges. Google lists a free tier for this model; if the configured Google project is on that tier and within quota, this call would be free. The project's actual billing tier and billed amount were not verified.

## Limits of the result

- One synthetic receipt is one observation, not an average or a guaranteed maximum. Receipt dimensions, item count, prompt context, provider model revisions and output length can change usage.
- A retry or provider fallback can result in multiple calls and higher cost per receipt.
- The current Cloud Run configuration selects DeepSeek first and Gemini as fallback for the main receipt proposal gateway.
- The test did not measure real-user receipts, backend/database infrastructure, or the full mobile-to-server workflow.
- DeepSeek's returned cached and uncached token breakdown was used; Gemini did not report a cache breakdown in this response.
- Successful HTTP responses and schema parsing do not establish extraction accuracy for all receipts.

Sources: [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/), [DeepSeek vision](https://api-docs.deepseek.com/guides/vision/), and [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing).

## Earlier tests using real receipts

The project also contains seven receipt images under `finance-ai-backend/test_receipts/inputs/`; receipts 01 and 02 are duplicates, giving six unique receipts. The saved experiment `test_receipts/experiments/expanded-r3-live-20260926/` contains provider token usage from 26 September 2026. The baseline `upright_q85`, pooled-transport condition has three observations of each unique receipt per provider: 18 parsed calls per model.

Repricing those historical token counts at the 26 October 2026 rates above gives the following arithmetic mean per provider call:

| Provider | Average input tokens | Average billable output tokens | Average calculated price per call | Range per call |
| --- | ---: | ---: | ---: | ---: |
| DeepSeek, off-peak | 888 | 266.3 | $0.00022401 | $0.00011952–$0.00047352 |
| Gemini, paid standard tier | 1,373 | 349.6 | $0.00128579 | $0.00093690–$0.00253440 |

For DeepSeek, each call uses its recorded cache-hit and cache-miss counts and the off-peak rates; peak prices double the result. For Gemini, billable output is the reported total less input, including any thinking tokens. The Gemini free-tier cost may be zero if the project qualifies and has quota available. These amounts reprice historical usage; they are not historical invoices.

The historical lab used its own prompt, schema and preprocessing policy, rather than the exact deployed app gateway measured above. Therefore, these are measurements from real receipt experiments, **not exact production costs**. Provider model versions, retry behavior and production catalog context can also differ. The six images are not a representative sample of all receipts, and the 18 calls per provider include repeated measurements of the same six receipts. No receipt content or private financial details are reproduced here.

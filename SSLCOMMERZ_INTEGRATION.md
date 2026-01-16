# SSLCommerz Integration Guide for MediBear Backend

## Step 1: Install SSLCommerz Package

```bash
composer require sslcommerz/library
```

## Step 2: Add Environment Variables

Add these to your `.env` file:

```env
# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=medib696a7a96c0dd8
SSLCOMMERZ_STORE_PASSWORD=medib696a7a96c0dd8@ssl
SSLCOMMERZ_IS_SANDBOX=true
SSLCOMMERZ_SUCCESS_URL="${APP_URL}/api/payment/success"
SSLCOMMERZ_FAIL_URL="${APP_URL}/api/payment/fail"
SSLCOMMERZ_CANCEL_URL="${APP_URL}/api/payment/cancel"
SSLCOMMERZ_IPN_URL="${APP_URL}/api/payment/ipn"

# Frontend URLs
FRONTEND_URL=http://localhost:5173
```

## Step 3: Create SSLCommerzPaymentController

Create file: `app/Http/Controllers/SSLCommerzPaymentController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SSLCommerzPaymentController extends Controller
{
    public function initiate(Request $request)
    {
        $orderId = $request->input('order_id');
        $order = Order::with(['customer', 'orderItems'])->findOrFail($orderId);

        // SSLCommerz configuration
        $post_data = array();
        $post_data['store_id'] = env('SSLCOMMERZ_STORE_ID');
        $post_data['store_passwd'] = env('SSLCOMMERZ_STORE_PASSWORD');
        $post_data['total_amount'] = $order->total_amount;
        $post_data['currency'] = "BDT";
        $post_data['tran_id'] = uniqid() . '_' . $order->id;
        $post_data['success_url'] = env('SSLCOMMERZ_SUCCESS_URL');
        $post_data['fail_url'] = env('SSLCOMMERZ_FAIL_URL');
        $post_data['cancel_url'] = env('SSLCOMMERZ_CANCEL_URL');
        $post_data['ipn_url'] = env('SSLCOMMERZ_IPN_URL');

        # CUSTOMER INFORMATION
        $post_data['cus_name'] = $order->customer->name;
        $post_data['cus_email'] = $order->customer->email ?? 'customer@medibear.com';
        $post_data['cus_add1'] = $order->address->address_line_1 ?? 'N/A';
        $post_data['cus_city'] = $order->address->city ?? 'Dhaka';
        $post_data['cus_state'] = $order->address->state ?? 'Dhaka';
        $post_data['cus_postcode'] = $order->address->zip_code ?? '1000';
        $post_data['cus_country'] = 'Bangladesh';
        $post_data['cus_phone'] = $order->customer->phone ?? '01700000000';

        # SHIPMENT INFORMATION
        $post_data['ship_name'] = $order->customer->name;
        $post_data['ship_add1'] = $order->address->address_line_1 ?? 'N/A';
        $post_data['ship_city'] = $order->address->city ?? 'Dhaka';
        $post_data['ship_state'] = $order->address->state ?? 'Dhaka';
        $post_data['ship_postcode'] = $order->address->zip_code ?? '1000';
        $post_data['ship_country'] = 'Bangladesh';

        # OPTIONAL PARAMETERS
        $post_data['value_a'] = $order->id; // Order ID
        $post_data['value_b'] = $order->customer_id; // Customer ID
        $post_data['value_c'] = $order->pharmacy_id; // Pharmacy ID
        $post_data['value_d'] = '';

        # PRODUCT INFORMATION
        $post_data['product_name'] = 'Medicines';
        $post_data['product_category'] = 'Pharmacy';
        $post_data['product_profile'] = 'general';

        # REQUEST SEND TO SSLCOMMERZ
        $direct_api_url = env('SSLCOMMERZ_IS_SANDBOX') == true 
            ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php" 
            : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $direct_api_url);
        curl_setopt($handle, CURLOPT_TIMEOUT, 30);
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($handle, CURLOPT_POST, 1);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE); // KEEP IT FALSE IF YOU RUN FROM LOCAL PC

        $content = curl_exec($handle);
        $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

        if ($code == 200 && !(curl_errno($handle))) {
            curl_close($handle);
            $sslcommerzResponse = json_decode($content, true);

            if (isset($sslcommerzResponse['GatewayPageURL']) && $sslcommerzResponse['GatewayPageURL'] != "") {
                // Store transaction ID in payment table
                Payment::updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'method' => 'online',
                        'status' => 'pending',
                        'amount' => $order->total_amount,
                        'transaction_id' => $post_data['tran_id'],
                    ]
                );

                return response()->json([
                    'success' => true,
                    'payment_url' => $sslcommerzResponse['GatewayPageURL']
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'SSL Session was not successful',
                    'data' => $sslcommerzResponse
                ], 422);
            }
        } else {
            curl_close($handle);
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect with SSLCOMMERZ',
                'error_code' => $code
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $val_id = $request->input('val_id');
        $amount = $request->input('amount');
        $order_id = $request->input('value_a');

        // Validate the transaction
        $validation = $this->validate_transaction($val_id, $amount, $tran_id, env('SSLCOMMERZ_STORE_ID'), env('SSLCOMMERZ_STORE_PASSWORD'));

        if ($validation) {
            // Update payment status
            $payment = Payment::where('transaction_id', $tran_id)->first();
            if ($payment) {
                $payment->status = 'success';
                $payment->transaction_id = $tran_id;
                $payment->gateway_transaction_id = $val_id;
                $payment->save();

                // Update order status
                $order = Order::find($order_id);
                if ($order) {
                    $order->status = 'processing';
                    $order->save();
                }
            }

            // Redirect to frontend success page
            return redirect(env('FRONTEND_URL') . '/payment-success?order_id=' . $order_id);
        } else {
            return redirect(env('FRONTEND_URL') . '/payment-failure?error=validation_failed');
        }
    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $order_id = $request->input('value_a');

        // Update payment status
        $payment = Payment::where('transaction_id', $tran_id)->first();
        if ($payment) {
            $payment->status = 'failed';
            $payment->save();
        }

        // Redirect to frontend failure page
        return redirect(env('FRONTEND_URL') . '/payment-failure?order_id=' . $order_id);
    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $order_id = $request->input('value_a');

        // Update payment status
        $payment = Payment::where('transaction_id', $tran_id)->first();
        if ($payment) {
            $payment->status = 'cancelled';
            $payment->save();
        }

        // Redirect to frontend cancel page
        return redirect(env('FRONTEND_URL') . '/payment-failure?order_id=' . $order_id . '&status=cancelled');
    }

    public function ipn(Request $request)
    {
        # RECEIVE ALL THE PAYMENT INFORMATION FROM IPN
        $tran_id = $request->input('tran_id');
        $val_id = $request->input('val_id');
        $amount = $request->input('amount');
        $status = $request->input('status');
        $order_id = $request->input('value_a');

        Log::info('SSLCommerz IPN received', $request->all());

        if ($status == 'VALID' || $status == 'VALIDATED') {
            $validation = $this->validate_transaction($val_id, $amount, $tran_id, env('SSLCOMMERZ_STORE_ID'), env('SSLCOMMERZ_STORE_PASSWORD'));

            if ($validation) {
                $payment = Payment::where('transaction_id', $tran_id)->first();
                if ($payment && $payment->status == 'pending') {
                    $payment->status = 'success';
                    $payment->gateway_transaction_id = $val_id;
                    $payment->save();

                    $order = Order::find($order_id);
                    if ($order && $order->status == 'pending') {
                        $order->status = 'processing';
                        $order->save();
                    }
                }
            }
        } else if ($status == 'FAILED') {
            $payment = Payment::where('transaction_id', $tran_id)->first();
            if ($payment) {
                $payment->status = 'failed';
                $payment->save();
            }
        } else if ($status == 'CANCELLED') {
            $payment = Payment::where('transaction_id', $tran_id)->first();
            if ($payment) {
                $payment->status = 'cancelled';
                $payment->save();
            }
        }

        return response()->json(['status' => 'success']);
    }

    private function validate_transaction($val_id, $amount, $tran_id, $store_id, $store_passwd)
    {
        $validation_api_url = env('SSLCOMMERZ_IS_SANDBOX') == true
            ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
            : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

        $validation_api_url .= "?val_id=" . urlencode($val_id);
        $validation_api_url .= "&store_id=" . urlencode($store_id);
        $validation_api_url .= "&store_passwd=" . urlencode($store_passwd);
        $validation_api_url .= "&v=1&format=json";

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $validation_api_url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0);

        $result = curl_exec($handle);
        $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

        if ($code == 200 && !(curl_errno($handle))) {
            $result = json_decode($result, true);

            if (isset($result['status']) && $result['status'] == 'VALID') {
                if ($result['tran_id'] == $tran_id && $result['amount'] == $amount) {
                    return true;
                }
            }
        }

        curl_close($handle);
        return false;
    }
}
```

## Step 4: Update OrderController

Modify your `app/Http/Controllers/OrderController.php` to handle online payments:

```php
public function create(Request $request)
{
    $validator = Validator::make($request->all(), [
        'pharmacy_id' => 'required|exists:users,id',
        'payment_type' => 'required|in:cod,online',
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
        'prescription' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    DB::beginTransaction();
    
    try {
        $user = auth()->user();
        
        // Get default address
        $defaultAddress = $user->addresses()->where('is_default', true)->first();
        if (!$defaultAddress) {
            return response()->json([
                'success' => false,
                'message' => 'No default address found. Please add a delivery address.'
            ], 422);
        }

        // Calculate total
        $subtotal = 0;
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            $subtotal += $product->price * $item['quantity'];
        }
        
        $deliveryFee = 50.00;
        $totalAmount = $subtotal + $deliveryFee;

        // Handle prescription upload
        $prescriptionPath = null;
        if ($request->hasFile('prescription')) {
            $prescriptionPath = $request->file('prescription')->store('prescriptions', 'public');
        }

        // Create order
        $order = Order::create([
            'customer_id' => $user->id,
            'pharmacy_id' => $request->pharmacy_id,
            'address_id' => $defaultAddress->id,
            'status' => 'pending',
            'total_amount' => $totalAmount,
            'payment_method' => $request->payment_type,
            'prescription_file' => $prescriptionPath,
            'delivery_fee' => $deliveryFee,
        ]);

        // Create order items
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            
            $order->orderItems()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'subtotal' => $product->price * $item['quantity'],
            ]);
        }

        DB::commit();

        // If payment type is online, initiate SSLCommerz payment
        if ($request->payment_type === 'online') {
            $paymentController = new SSLCommerzPaymentController();
            $paymentResponse = $paymentController->initiate(new Request(['order_id' => $order->id]));
            
            return $paymentResponse;
        }

        // For COD, return success
        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'data' => $order->load(['orderItems.product', 'customer', 'pharmacy'])
        ]);

    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Order creation failed: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to create order',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

## Step 5: Add Routes

Add these routes to `routes/api.php`:

```php
// Payment routes (SSLCommerz)
Route::post('/payment/initiate', [SSLCommerzPaymentController::class, 'initiate'])->middleware('auth:sanctum');
Route::post('/payment/success', [SSLCommerzPaymentController::class, 'success'])->name('payment.success');
Route::post('/payment/fail', [SSLCommerzPaymentController::class, 'fail'])->name('payment.fail');
Route::post('/payment/cancel', [SSLCommerzPaymentController::class, 'cancel'])->name('payment.cancel');
Route::post('/payment/ipn', [SSLCommerzPaymentController::class, 'ipn'])->name('payment.ipn');
```

## Step 6: Update Payment Migration

Ensure your payments table has these columns:

```php
Schema::create('payments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->enum('method', ['cod', 'online'])->default('cod');
    $table->enum('status', ['pending', 'success', 'failed', 'cancelled'])->default('pending');
    $table->decimal('amount', 10, 2);
    $table->string('transaction_id')->nullable();
    $table->string('gateway_transaction_id')->nullable();
    $table->timestamps();
});
```

## Testing

### Sandbox Test Cards:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test Mobile Banking:
Use the SSLCommerz sandbox credentials provided in your merchant panel.

## Go Live Checklist:
1. Change `SSLCOMMERZ_IS_SANDBOX=false` in `.env`
2. Update store credentials with live credentials
3. Test with real payment methods
4. Monitor IPN logs for payment confirmations

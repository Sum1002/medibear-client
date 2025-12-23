# Backend API Routes for Pharmacy Profile

## 1. Add Route in `routes/api.php`:

```php
// Pharmacy Profile
Route::get('/pharmacy/profile', [PharmacyController::class, 'getProfile'])->middleware('auth:sanctum');
Route::post('/pharmacy/update-profile', [PharmacyController::class, 'updateProfile'])->middleware('auth:sanctum');
```

## 2. Add Methods in `app/Http/Controllers/PharmacyController.php`:

```php
public function getProfile(Request $request)
{
    $pharmacy = auth()->user();
    
    return response()->json([
        'success' => true,
        'data' => $pharmacy
    ]);
}

public function updateProfile(Request $request)
{
    $pharmacy = auth()->user();
    
    $validator = Validator::make($request->all(), [
        'name' => 'sometimes|string|max:255',
        'address' => 'nullable|string|max:500',
        'google_map_link' => 'nullable|url|max:500',
        'is_open' => 'sometimes|boolean',
        'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
    ]);
    
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }
    
    // Update basic info
    if ($request->has('name')) {
        $pharmacy->name = $request->name;
    }
    if ($request->has('address')) {
        $pharmacy->address = $request->address;
    }
    if ($request->has('google_map_link')) {
        $pharmacy->google_map_link = $request->google_map_link;
    }
    if ($request->has('is_open')) {
        $pharmacy->is_open = $request->is_open;
    }
    
    // Handle profile picture upload
    if ($request->hasFile('profile_picture')) {
        // Delete old profile picture if exists
        if ($pharmacy->profile_picture && Storage::disk('public')->exists($pharmacy->profile_picture)) {
            Storage::disk('public')->delete($pharmacy->profile_picture);
        }
        
        // Store new profile picture
        $path = $request->file('profile_picture')->store('pharmacy_pictures', 'public');
        $pharmacy->profile_picture = $path;
    }
    
    $pharmacy->save();
    
    return response()->json([
        'success' => true,
        'message' => 'Pharmacy profile updated successfully',
        'data' => $pharmacy
    ]);
}
```

## 3. Add Columns to Users Table (if not exists):

Run this migration:

```bash
php artisan make:migration add_pharmacy_profile_fields_to_users_table
```

Then in the migration file:

```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('profile_picture')->nullable()->after('email');
        $table->string('google_map_link')->nullable()->after('address');
        $table->boolean('is_open')->default(true)->after('google_map_link');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['profile_picture', 'google_map_link', 'is_open']);
    });
}
```

Run the migration:
```bash
php artisan migrate
```

## 4. Make sure to import at the top of PharmacyController:

```php
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
```

---

After adding these to your Laravel backend, the pharmacy profile update will work!
